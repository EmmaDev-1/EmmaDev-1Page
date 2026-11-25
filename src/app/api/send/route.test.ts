import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

/**
 * What this proxy is for is the headers, not the body — the body is passed
 * through untouched. Every assertion here is a property that, if it broke,
 * would leave analytics apparently working while quietly recording the wrong
 * thing:
 *
 *   - no forwarded IP and every visitor is located wherever the function ran;
 *   - no user agent and, per Umami's API docs, the request is not registered
 *     at all;
 *   - no `x-umami-*` headers and the gateway loses the session state it just
 *     handed back.
 *
 * None of those surface as an error anywhere, which is the argument for
 * asserting them.
 */
const GATEWAY = 'https://gateway.umami.is/api/send';

const PAYLOAD = JSON.stringify({
  type: 'event',
  payload: { website: '94db1cb1-74f4-4a40-ad6c-962362670409', url: '/', hostname: 'emmadev.dev' },
});

function beacon(headers: Record<string, string>): Request {
  return new Request('https://emmadev.dev/api/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: PAYLOAD,
  });
}

/** Stands in for the gateway and records what reached it. */
function stubGateway(body = '{"cache":"abc"}', status = 200) {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(
      new Response(body, { status, headers: { 'content-type': 'application/json' } }),
    );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

/** The headers the route actually sent upstream. */
function sentHeaders(fetchMock: ReturnType<typeof stubGateway>): Headers {
  const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
  return new Headers(init.headers);
}

describe('POST /api/send', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('forwards the payload to Umami Cloud unchanged', async () => {
    const fetchMock = stubGateway();

    await POST(beacon({ 'user-agent': 'Mozilla/5.0' }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(GATEWAY);
    expect(init.method).toBe('POST');
    expect(init.body).toBe(PAYLOAD);
  });

  it('forwards the user agent, which the gateway requires to register a hit', async () => {
    const fetchMock = stubGateway();

    await POST(beacon({ 'user-agent': 'Mozilla/5.0 (iPhone)' }));

    expect(sentHeaders(fetchMock).get('user-agent')).toBe('Mozilla/5.0 (iPhone)');
  });

  it('sends an empty user agent rather than none when the client sent none', async () => {
    const fetchMock = stubGateway();

    await POST(beacon({}));

    expect(sentHeaders(fetchMock).get('user-agent')).toBe('');
  });

  it('forwards the visitor IP so location is resolved from them, not from us', async () => {
    const fetchMock = stubGateway();

    await POST(beacon({ 'x-real-ip': '203.0.113.7' }));

    expect(sentHeaders(fetchMock).get('x-forwarded-for')).toBe('203.0.113.7');
  });

  it('prefers x-real-ip over a client-prependable x-forwarded-for', async () => {
    const fetchMock = stubGateway();

    await POST(
      beacon({ 'x-real-ip': '203.0.113.7', 'x-forwarded-for': '198.51.100.1, 203.0.113.7' }),
    );

    expect(sentHeaders(fetchMock).get('x-forwarded-for')).toBe('203.0.113.7');
  });

  it('falls back to the first x-forwarded-for entry', async () => {
    const fetchMock = stubGateway();

    await POST(beacon({ 'x-forwarded-for': '203.0.113.7, 70.41.3.18' }));

    expect(sentHeaders(fetchMock).get('x-forwarded-for')).toBe('203.0.113.7');
  });

  it('sends no forwarded-for header at all when the platform reported no address', async () => {
    const fetchMock = stubGateway();

    await POST(beacon({}));

    expect(sentHeaders(fetchMock).has('x-forwarded-for')).toBe(false);
  });

  it("forwards the tracker's own x-umami-* headers, which are not in the body", async () => {
    const fetchMock = stubGateway();

    await POST(
      beacon({
        'x-umami-website-id': '94db1cb1-74f4-4a40-ad6c-962362670409',
        'x-umami-hostname': 'emmadev.dev',
        'x-umami-cache': 'session-state-from-the-gateway',
      }),
    );

    const headers = sentHeaders(fetchMock);
    expect(headers.get('x-umami-website-id')).toBe('94db1cb1-74f4-4a40-ad6c-962362670409');
    expect(headers.get('x-umami-hostname')).toBe('emmadev.dev');
    expect(headers.get('x-umami-cache')).toBe('session-state-from-the-gateway');
  });

  it("returns the gateway's response body, which the tracker reads back", async () => {
    stubGateway('{"cache":"abc","disabled":false}');

    const response = await POST(beacon({}));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ cache: 'abc', disabled: false });
  });

  it('reports a gateway error instead of pretending the hit landed', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ENOTFOUND')));

    const response = await POST(beacon({}));

    expect(response.status).toBe(502);
  });

  it('refuses an oversized body rather than relaying it to a third party', async () => {
    const fetchMock = stubGateway();
    const request = new Request('https://emmadev.dev/api/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'x'.repeat(64 * 1024 + 1),
    });

    const response = await POST(request);

    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

<?php

namespace Tests\Unit\Middleware;

use App\Http\Middleware\AuditMiddleware;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Tests\TestCase;

class AuditMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    private AuditMiddleware $middleware;

    protected function setUp(): void
    {
        parent::setUp();
        $this->middleware = new AuditMiddleware();
    }

    private function createRequest(
        string $method = 'GET',
        string $uri = '/api/test',
        array $body = [],
        ?User $user = null,
        ?string $ip = '192.168.1.1',
        ?string $userAgent = 'TestBrowser/1.0'
    ): Request {
        $request = Request::create($uri, $method, $body);
        $request->headers->set('User-Agent', $userAgent);
        $request->server->set('REMOTE_ADDR', $ip);

        if ($user) {
            $request->setUserResolver(fn () => $user);
        }

        return $request;
    }

    private function handleRequest(Request $request, int $statusCode = 200): Response
    {
        $next = fn ($req) => new Response('OK', $statusCode);

        return $this->middleware->handle($request, $next);
    }

    public function test_creates_audit_log_record_for_each_request(): void
    {
        $request = $this->createRequest();
        $this->handleRequest($request);

        $this->assertEquals(1, AuditLog::count());
    }

    public function test_logs_correct_action(): void
    {
        $request = $this->createRequest('POST', '/api/users');
        $this->handleRequest($request);

        $log = AuditLog::first();
        $this->assertNotNull($log);
        $this->assertEquals('POST api/users', $log->action);
    }

    public function test_logs_ip_address_and_user_agent(): void
    {
        $request = $this->createRequest(
            ip: '10.0.0.1',
            userAgent: 'Mozilla/5.0'
        );
        $this->handleRequest($request);

        $log = AuditLog::first();
        $this->assertNotNull($log);
        $this->assertEquals('10.0.0.1', $log->ip_address);
        $this->assertEquals('Mozilla/5.0', $log->user_agent);
    }

    public function test_sanitizes_password_fields_from_request_body(): void
    {
        $request = $this->createRequest('POST', '/api/login', [
            'email' => 'test@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ]);
        $this->handleRequest($request);

        $log = AuditLog::first();
        $this->assertNotNull($log);

        // request_body should contain email but not password fields
        $body = $log->request_body;
        $this->assertIsArray($body);
        $this->assertArrayHasKey('email', $body);
        $this->assertArrayNotHasKey('password', $body);
        $this->assertArrayNotHasKey('password_confirmation', $body);
    }

    public function test_sanitizes_token_fields_from_request_body(): void
    {
        $request = $this->createRequest('POST', '/api/token', [
            'grant_type' => 'refresh',
            'access_token' => 'some-token',
            'refresh_token' => 'some-refresh-token',
        ]);
        $this->handleRequest($request);

        $log = AuditLog::first();
        $this->assertNotNull($log);

        $body = $log->request_body;
        $this->assertIsArray($body);
        $this->assertArrayHasKey('grant_type', $body);
        $this->assertArrayNotHasKey('access_token', $body);
        $this->assertArrayNotHasKey('refresh_token', $body);
    }

    public function test_records_response_status_code(): void
    {
        $request = $this->createRequest();
        $this->handleRequest($request, 201);

        $log = AuditLog::first();
        $this->assertNotNull($log);
        $this->assertEquals(201, $log->response_status);
    }

    public function test_works_for_authenticated_users(): void
    {
        $user = User::factory()->create();
        $request = $this->createRequest(user: $user);
        $this->handleRequest($request);

        $log = AuditLog::first();
        $this->assertNotNull($log);
        $this->assertEquals($user->id, $log->user_id);
    }

    public function test_works_for_unauthenticated_requests(): void
    {
        $request = $this->createRequest();
        $this->handleRequest($request);

        $log = AuditLog::first();
        $this->assertNotNull($log);
        $this->assertNull($log->user_id);
    }

    public function test_catches_exception_and_continues_when_audit_log_creation_fails(): void
    {
        // Drop the audit_logs table to force an exception during create
        \Illuminate\Support\Facades\Schema::drop('audit_logs');

        $request = $this->createRequest();
        $response = $this->handleRequest($request);

        // The middleware should catch the exception and still return the response
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('OK', $response->getContent());
    }

    public function test_returns_null_for_empty_sanitized_request_body(): void
    {
        // Send only sensitive fields so sanitization returns empty array -> null
        $request = $this->createRequest('POST', '/api/login', [
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'access_token' => 'tok',
            'refresh_token' => 'ref',
        ]);
        $this->handleRequest($request);

        $log = AuditLog::first();
        $this->assertNotNull($log);
        $this->assertNull($log->request_body);
    }

    // ─── Edge Cases ────────────────────────────────────────────────────

    public function test_logs_correct_response_status_for_errors(): void
    {
        $request = $this->createRequest('GET', '/api/test');
        $this->handleRequest($request, 500);

        $log = AuditLog::first();
        $this->assertNotNull($log);
        $this->assertEquals(500, $log->response_status);
    }

    public function test_handles_get_request_with_no_body(): void
    {
        $request = $this->createRequest('GET', '/api/test');
        $this->handleRequest($request);

        $log = AuditLog::first();
        $this->assertNotNull($log);
        $this->assertNull($log->request_body);
    }
}

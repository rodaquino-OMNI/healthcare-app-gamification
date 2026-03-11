<?php

namespace App\Http\Middleware;

use App\Models\AuditLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuditMiddleware
{
    /**
     * Log the request to the audit_logs table.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        try {
            AuditLog::create([
                'user_id' => $request->user()?->id,
                'action' => $request->method() . ' ' . $request->path(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'request_body' => $this->sanitizeRequestBody($request),
                'response_status' => $response->getStatusCode(),
                'performed_at' => now(),
            ]);
        } catch (\Throwable $e) {
            report($e);
        }

        return $response;
    }

    /**
     * Remove sensitive fields from the request body before logging.
     */
    private function sanitizeRequestBody(Request $request): ?array
    {
        $data = $request->except(['password', 'password_confirmation', 'access_token', 'refresh_token']);

        return ! empty($data) ? $data : null;
    }
}

<?php

namespace Tests\Unit\Middleware;

use App\Http\Middleware\LocaleMiddleware;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\App;
use Tests\TestCase;

class LocaleMiddlewareTest extends TestCase
{
    private LocaleMiddleware $middleware;

    protected function setUp(): void
    {
        parent::setUp();
        $this->middleware = new LocaleMiddleware();
    }

    private function handleWithLocale(?string $acceptLanguage): Response
    {
        $request = Request::create('/api/test', 'GET');

        if ($acceptLanguage !== null) {
            $request->headers->set('Accept-Language', $acceptLanguage);
        } else {
            $request->headers->remove('Accept-Language');
        }

        $next = fn ($req) => new Response('OK');

        return $this->middleware->handle($request, $next);
    }

    public function test_sets_locale_to_pt_br_when_accept_language_is_pt_br(): void
    {
        $this->handleWithLocale('pt-BR');

        $this->assertEquals('pt_BR', App::getLocale());
    }

    public function test_sets_locale_to_en_when_accept_language_is_en(): void
    {
        $this->handleWithLocale('en');

        $this->assertEquals('en', App::getLocale());
    }

    public function test_sets_locale_to_es_when_accept_language_is_es(): void
    {
        $this->handleWithLocale('es');

        $this->assertEquals('es', App::getLocale());
    }

    public function test_falls_back_to_default_when_unsupported_language(): void
    {
        $defaultLocale = App::getLocale();

        $this->handleWithLocale('ja');

        $this->assertEquals($defaultLocale, App::getLocale());
    }

    public function test_handles_language_prefix_matching(): void
    {
        $this->handleWithLocale('pt');

        $this->assertEquals('pt_BR', App::getLocale());
    }

    public function test_handles_null_accept_language_header(): void
    {
        $defaultLocale = App::getLocale();

        $this->handleWithLocale(null);

        $this->assertEquals($defaultLocale, App::getLocale());
    }

    // ─── Edge Cases ────────────────────────────────────────────────────

    public function test_sets_locale_to_pt_BR_from_header(): void
    {
        $this->handleWithLocale('pt-BR');

        $this->assertEquals('pt_BR', App::getLocale());
    }

    public function test_sets_locale_to_es_from_header(): void
    {
        $this->handleWithLocale('es');

        $this->assertEquals('es', App::getLocale());
    }

    public function test_falls_back_to_en_for_unsupported_locale(): void
    {
        $defaultLocale = App::getLocale();

        $this->handleWithLocale('fr');

        $this->assertEquals($defaultLocale, App::getLocale());
    }

    public function test_handles_missing_accept_language_header(): void
    {
        $defaultLocale = App::getLocale();

        $this->handleWithLocale(null);

        $this->assertEquals($defaultLocale, App::getLocale());
    }

    public function test_handles_language_prefix_match(): void
    {
        $this->handleWithLocale('pt');

        $this->assertEquals('pt_BR', App::getLocale());
    }
}

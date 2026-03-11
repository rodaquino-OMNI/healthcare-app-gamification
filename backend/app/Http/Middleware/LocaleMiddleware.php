<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class LocaleMiddleware
{
    private const SUPPORTED_LOCALES = ['pt_BR', 'en', 'es'];

    /**
     * Set the application locale from the Accept-Language header.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $this->parseLocale($request->header('Accept-Language'));

        if ($locale) {
            App::setLocale($locale);
        }

        return $next($request);
    }

    /**
     * Parse the Accept-Language header and return the best matching supported locale.
     */
    private function parseLocale(?string $header): ?string
    {
        if (! $header) {
            return null;
        }

        $preferred = explode(',', $header);

        foreach ($preferred as $lang) {
            $lang = trim(explode(';', $lang)[0]);
            $lang = str_replace('-', '_', $lang);

            if (in_array($lang, self::SUPPORTED_LOCALES, true)) {
                return $lang;
            }

            // Try matching just the language part (e.g., "pt" matches "pt_BR")
            $short = explode('_', $lang)[0];
            foreach (self::SUPPORTED_LOCALES as $supported) {
                if (str_starts_with($supported, $short)) {
                    return $supported;
                }
            }
        }

        return null;
    }
}

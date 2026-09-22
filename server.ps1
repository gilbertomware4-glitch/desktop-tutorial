$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8000/')
$listener.Start()
Write-Host 'Flowline is running at http://localhost:8000/index.html'

$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.css' = 'text/css; charset=utf-8'
    '.js' = 'application/javascript; charset=utf-8'
    '.bat' = 'text/plain; charset=utf-8'
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $relativePath = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))
        if ([string]::IsNullOrWhiteSpace($relativePath)) { $relativePath = 'index.html' }
        $filePath = Join-Path $root $relativePath
        $resolvedRoot = [IO.Path]::GetFullPath($root)
        $resolvedFile = [IO.Path]::GetFullPath($filePath)

        if ($resolvedFile.StartsWith($resolvedRoot) -and (Test-Path $resolvedFile -PathType Leaf)) {
            $bytes = [IO.File]::ReadAllBytes($resolvedFile)
            $extension = [IO.Path]::GetExtension($resolvedFile).ToLowerInvariant()
            $context.Response.ContentType = if ($mimeTypes.ContainsKey($extension)) { $mimeTypes[$extension] } else { 'application/octet-stream' }
            $context.Response.StatusCode = 200
        } else {
            $bytes = [Text.Encoding]::UTF8.GetBytes('Not found')
            $context.Response.ContentType = 'text/plain; charset=utf-8'
            $context.Response.StatusCode = 404
        }

        $context.Response.ContentLength64 = $bytes.Length
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        $context.Response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}

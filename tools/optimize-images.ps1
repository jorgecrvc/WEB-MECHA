# MECHA Tattoo — copia la curación a portfolio-seleccionado/ y genera
# versiones optimizadas (JPEG redimensionado, orientación EXIF aplicada)
# en web/assets/img/. No modifica nada en portfolio-original/.

Add-Type -AssemblyName System.Drawing

$root = "C:\Users\jchco\Documents\PROYECTOS-WEB\mecha-tattoo"
$srcDir = Join-Path $root "portfolio-original"
$selDir = Join-Path $root "portfolio-seleccionado"
$outDir = Join-Path $root "web\assets\img\portfolio"

# nombre destino = categoria-NN ; tercer campo = tamaño máximo en px
$selection = @(
    @{ src = "20260520-130557674.jpg"; cat = "organico";    name = "organico-01" },
    @{ src = "20260520-130603611.jpg"; cat = "organico";    name = "organico-02" },
    @{ src = "20260520-130614676.jpg"; cat = "organico";    name = "organico-03" },
    @{ src = "20260520-130621428.jpg"; cat = "organico";    name = "organico-04" },
    @{ src = "IMG_1796.jpg";           cat = "organico";    name = "organico-05" },
    @{ src = "IMG_4302.JPG";           cat = "ornamental";  name = "ornamental-01" },
    @{ src = "IMG_4312.JPG";           cat = "ornamental";  name = "ornamental-02" },
    @{ src = "IMG_4318.JPG";           cat = "ornamental";  name = "ornamental-03" },
    @{ src = "IMG_4322.JPG";           cat = "ornamental";  name = "ornamental-04" },
    @{ src = "01000922.JPG";           cat = "ilustrativo"; name = "ilustrativo-01" },
    @{ src = "Archivo_000.png";        cat = "ilustrativo"; name = "ilustrativo-02" },
    @{ src = "Archivo_001.png";        cat = "ilustrativo"; name = "ilustrativo-03" },
    @{ src = "IMG_0363.jpg";           cat = "black-gray";  name = "blackgray-01" },
    @{ src = "IMG_0354.jpg";           cat = "black-gray";  name = "blackgray-02" },
    @{ src = "IMG_5103.jpg";           cat = "black-gray";  name = "blackgray-03" },
    @{ src = "IMG_5109.jpg";           cat = "black-gray";  name = "blackgray-04" },
    @{ src = "P1000492.JPG";           cat = "proceso";     name = "proceso-01" },
    @{ src = "P1000552.JPG";           cat = "proceso";     name = "proceso-02" }
)

function Apply-ExifOrientation([System.Drawing.Image]$img) {
    if ($img.PropertyIdList -contains 274) {
        $o = $img.GetPropertyItem(274).Value[0]
        switch ($o) {
            3 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
            6 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
            8 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
        }
        try { $img.RemovePropertyItem(274) } catch {}
    }
}

function Save-Resized([string]$inPath, [string]$outPath, [int]$maxEdge, [long]$quality) {
    $img = [System.Drawing.Image]::FromFile($inPath)
    try {
        Apply-ExifOrientation $img
        $w = $img.Width; $h = $img.Height
        $scale = [Math]::Min(1.0, $maxEdge / [double][Math]::Max($w, $h))
        $nw = [int][Math]::Round($w * $scale); $nh = [int][Math]::Round($h * $scale)
        $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($img, 0, 0, $nw, $nh)
        $g.Dispose()
        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)
        $bmp.Save($outPath, $codec, $ep)
        $bmp.Dispose()
        return "$([System.IO.Path]::GetFileName($outPath)) ${nw}x${nh}"
    } finally { $img.Dispose() }
}

New-Item -ItemType Directory -Force $outDir | Out-Null

foreach ($item in $selection) {
    $in = Join-Path $srcDir $item.src
    # 1) copia de la curación (archivo íntegro, sin tocar) a portfolio-seleccionado/<categoria>/
    $catDir = Join-Path $selDir $item.cat
    New-Item -ItemType Directory -Force $catDir | Out-Null
    Copy-Item $in (Join-Path $catDir $item.src) -Force
    # 2) versión web optimizada
    $out = Join-Path $outDir "$($item.name).jpg"
    Save-Resized $in $out 1400 82
}

# Hero (pieza orgánica con luz roja) a mayor resolución + imagen OG
Save-Resized (Join-Path $srcDir "20260520-130603611.jpg") (Join-Path $root "web\assets\img\hero.jpg") 1920 80
Save-Resized (Join-Path $srcDir "20260520-130603611.jpg") (Join-Path $root "web\assets\img\og-cover.jpg") 1200 78

# Retrato para "Sobre Mecha"
Save-Resized (Join-Path $root "branding\foto angel.JPG") (Join-Path $root "web\assets\img\sobre-mecha.jpg") 1200 82

"DONE"

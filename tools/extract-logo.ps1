# Extrae el logo "El demonio del Mecha" (versión clara sobre rojo) de la guía
# de branding y genera PNGs transparentes en crema (#EFC29A) para web + favicon.

Add-Type -AssemblyName System.Drawing

$src = "C:\Users\jchco\Documents\PROYECTOS-WEB\mecha-tattoo\branding\guia-visual\paleta de colores, fuentes.JPG"
$outDir = "C:\Users\jchco\Documents\PROYECTOS-WEB\mecha-tattoo\web\assets\img"
New-Item -ItemType Directory -Force $outDir | Out-Null

$img = [System.Drawing.Bitmap]::FromFile($src)

# Región del logo blanco sobre fondo rojo (sección superior de la guía)
$crop = New-Object System.Drawing.Rectangle(660, 140, 380, 550)
$logo = $img.Clone($crop, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$img.Dispose()

# Máscara: luminancia alta -> opaco en color crema; fondo rojo oscuro -> transparente
$cr = 0xEF; $cg = 0xC2; $cb = 0x9A
for ($y = 0; $y -lt $logo.Height; $y++) {
    for ($x = 0; $x -lt $logo.Width; $x++) {
        $p = $logo.GetPixel($x, $y)
        $lum = 0.299*$p.R + 0.587*$p.G + 0.114*$p.B
        $a = [int][Math]::Max(0, [Math]::Min(255, ($lum - 90) * 255 / 90))
        $logo.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $cr, $cg, $cb))
    }
}

function Save-Scaled([System.Drawing.Bitmap]$bmp, [string]$path, [int]$maxEdge) {
    $scale = $maxEdge / [double][Math]::Max($bmp.Width, $bmp.Height)
    $nw = [int][Math]::Round($bmp.Width * $scale); $nh = [int][Math]::Round($bmp.Height * $scale)
    $out = New-Object System.Drawing.Bitmap($nw, $nh)
    $g = [System.Drawing.Graphics]::FromImage($out)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($bmp, 0, 0, $nw, $nh)
    $g.Dispose()
    $out.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $out.Dispose()
    "saved $path ${nw}x${nh}"
}

$logo.Save((Join-Path $outDir "logo-demonio.png"), [System.Drawing.Imaging.ImageFormat]::Png)
"saved logo-demonio.png $($logo.Width)x$($logo.Height)"
Save-Scaled $logo (Join-Path $outDir "favicon-256.png") 256
Save-Scaled $logo (Join-Path $outDir "favicon-32.png") 32
$logo.Dispose()
"DONE"

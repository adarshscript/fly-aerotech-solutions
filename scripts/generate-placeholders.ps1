Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$public = Join-Path $PSScriptRoot "..\public"
New-Item -ItemType Directory -Path $public -Force | Out-Null

function New-GradientImage {
  param(
    [int]$Width,
    [int]$Height,
    [string]$Path,
    [string]$Title,
    [string]$Subtitle,
    [string]$C1,
    [string]$C2,
    [string]$Accent,
    [bool]$Rounded = $false
  )

  $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $color1 = [System.Drawing.ColorTranslator]::FromHtml($C1)
  $color2 = [System.Drawing.ColorTranslator]::FromHtml($C2)
  $accentColor = [System.Drawing.ColorTranslator]::FromHtml($Accent)

  $rect = New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)
  $gradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $color1, $color2, [float]45)
  if ($Rounded) {
    $radius = [int]([Math]::Min($Width, $Height) * 0.22)
    $clipPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = [int]($radius * 2)
    $clipPath.AddArc(0, 0, $d, $d, 180, 90)
    $clipPath.AddArc($Width - $d, 0, $d, $d, 270, 90)
    $clipPath.AddArc($Width - $d, $Height - $d, $d, $d, 0, 90)
    $clipPath.AddArc(0, $Height - $d, $d, $d, 90, 90)
    $clipPath.CloseFigure()
    $graphics.FillPath($gradient, $clipPath)
  } else {
    $graphics.FillRectangle($gradient, $rect)
  }

  $grid = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(18, 255, 255, 255))
  $step = [Math]::Max(40, [int]($Width / 12))
  for ($x = 0; $x -lt $Width; $x += $step) {
    $graphics.FillRectangle($grid, $x, 0, 1, $Height)
  }
  for ($y = 0; $y -lt $Height; $y += $step) {
    $graphics.FillRectangle($grid, 0, $y, $Width, 1)
  }

  $orb = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(45, 255, 255, 255))
  $orbSize = [int]($Width * 0.5)
  $graphics.FillEllipse($orb, $Width - [int]($orbSize * 0.8), -[int]($orbSize * 0.3), $orbSize, $orbSize)

  $accentBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb($accentColor.A, $accentColor.R, $accentColor.G, $accentColor.B))
  $barW = [int]($Width * 0.22)
  $barH = [Math]::Max(6, [int]($Height * 0.012))
  $graphics.FillRectangle($accentBrush, [int]($Width * 0.5 - $barW / 2), [int]($Height * 0.68), $barW, $barH)

  $fontTitle = New-Object System.Drawing.Font("Segoe UI", [float]([Math]::Max(20, $Width / 16)), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $fontSub = New-Object System.Drawing.Font("Segoe UI", [float]([Math]::Max(11, $Width / 42)), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $whiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)

  $titleSize = $graphics.MeasureString($Title, $fontTitle)
  $graphics.DrawString(
    $Title,
    $fontTitle,
    $whiteBrush,
    [float](($Width - $titleSize.Width) / 2),
    [float](($Height - $titleSize.Height) / 2 - ($titleSize.Height * 0.35))
  )

  if ($Subtitle) {
    $subSize = $graphics.MeasureString($Subtitle, $fontSub)
    $graphics.DrawString(
      $Subtitle,
      $fontSub,
      $whiteBrush,
      [float](($Width - $subSize.Width) / 2),
      [float](($Height - $subSize.Height) / 2 + ($titleSize.Height * 0.45))
    )
  }

  $graphics.Dispose()
  $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Jpeg)
  $bitmap.Dispose()
}

function New-Favicon {
  param([string]$Path)

  $bitmap = New-Object System.Drawing.Bitmap(64, 64)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $color1 = [System.Drawing.ColorTranslator]::FromHtml("#0B1E3D")
  $color2 = [System.Drawing.ColorTranslator]::FromHtml("#163A75")
  $accentColor = [System.Drawing.ColorTranslator]::FromHtml("#0FC98B")
  $rect = New-Object System.Drawing.Rectangle(0, 0, 64, 64)
  $gradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $color1, $color2, [float]45)

  $radius = 14
  $clipPath = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $radius * 2
  $clipPath.AddArc(0, 0, $d, $d, 180, 90)
  $clipPath.AddArc(48, 0, $d, $d, 270, 90)
  $clipPath.AddArc(48, 48, $d, $d, 0, 90)
  $clipPath.AddArc(0, 48, $d, $d, 90, 90)
  $clipPath.CloseFigure()
  $graphics.FillPath($gradient, $clipPath)

  $accentBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb($accentColor.A, $accentColor.R, $accentColor.G, $accentColor.B))
  $graphics.FillRectangle($accentBrush, 10, 44, 44, 4)

  $font = New-Object System.Drawing.Font("Segoe UI", 30, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $whiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
  $size = $graphics.MeasureString("F", $font)
  $graphics.DrawString("F", $font, $whiteBrush, [float]((64 - $size.Width) / 2), [float]((64 - $size.Height) / 2 - 4))

  $graphics.Dispose()
  $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

$navy = "#0B1E3D"
$navy2 = "#163A75"
$tech = "#0FC98B"
$deep = "#081730"
$teal = "#0D8C63"

New-Favicon -Path (Join-Path $public "favicon.png")
Write-Output "generated favicon.png"

New-GradientImage -Width 512 -Height 512 -Path (Join-Path $public "logo.jpg") -Title "FA" -Subtitle "FLY AEROTECH SOLUTIONS" -C1 $navy -C2 $navy2 -Accent $tech
Write-Output "generated logo.jpg"

New-GradientImage -Width 1600 -Height 1000 -Path (Join-Path $public "hero1.jpg") -Title "HERO 1" -Subtitle "Software. Training. Internships." -C1 $deep -C2 $navy2 -Accent $tech
New-GradientImage -Width 1600 -Height 1000 -Path (Join-Path $public "hero2.jpg") -Title "HERO 2" -Subtitle "Build Tomorrow's Software Today" -C1 "#0B1E3D" -C2 "#0D3A6B" -Accent $tech
New-GradientImage -Width 1600 -Height 1000 -Path (Join-Path $public "hero3.jpg") -Title "HERO 3" -Subtitle "Learn By Building Real Projects" -C1 "#071527" -C2 "#14324F" -Accent $teal
Write-Output "generated hero1-3.jpg"

New-GradientImage -Width 900 -Height 675 -Path (Join-Path $public "gallery1.jpg") -Title "GALLERY 1" -Subtitle "Work Culture" -C1 $navy -C2 $navy2 -Accent $tech
New-GradientImage -Width 900 -Height 675 -Path (Join-Path $public "gallery2.jpg") -Title "GALLERY 2" -Subtitle "Training Sessions" -C1 "#0B2A3D" -C2 "#0D3A6B" -Accent $teal
New-GradientImage -Width 900 -Height 675 -Path (Join-Path $public "gallery3.jpg") -Title "GALLERY 3" -Subtitle "Team Events" -C1 "#101B3A" -C2 "#1E4E7A" -Accent $tech
Write-Output "generated gallery1-3.jpg"

New-GradientImage -Width 900 -Height 675 -Path (Join-Path $public "course1.jpg") -Title "COURSE 1" -Subtitle "Full-Stack Web Development" -C1 $deep -C2 $navy2 -Accent $tech
New-GradientImage -Width 900 -Height 675 -Path (Join-Path $public "course2.jpg") -Title "COURSE 2" -Subtitle "Python Programming" -C1 "#0C3B2E" -C2 "#14324F" -Accent $teal
Write-Output "generated course1-2.jpg"

New-GradientImage -Width 900 -Height 675 -Path (Join-Path $public "service1.jpg") -Title "SERVICE 1" -Subtitle "Software Development" -C1 $navy -C2 $navy2 -Accent $tech
New-GradientImage -Width 900 -Height 675 -Path (Join-Path $public "service2.jpg") -Title "SERVICE 2" -Subtitle "Web Development" -C1 "#0B2A3D" -C2 "#0D3A6B" -Accent $teal
New-GradientImage -Width 900 -Height 675 -Path (Join-Path $public "service3.jpg") -Title "SERVICE 3" -Subtitle "Training & Internship" -C1 "#101B3A" -C2 "#1E4E7A" -Accent $tech
Write-Output "generated service1-3.jpg"

New-GradientImage -Width 600 -Height 600 -Path (Join-Path $public "team1.jpg") -Title "TEAM" -Subtitle "Fly Aerotech Solutions" -C1 $navy -C2 $navy2 -Accent $tech
Write-Output "generated team1.jpg"

Write-Output "All placeholders generated."

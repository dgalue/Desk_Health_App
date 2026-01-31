$certPath = "cert.pfx"
$password = "password"
$securePassword = ConvertTo-SecureString -String $password -Force -AsPlainText
$cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=Diego Galue" -CertStoreLocation "Cert:\CurrentUser\My"
$cert | Export-PfxCertificate -FilePath $certPath -Password $securePassword
Write-Host "Certificate created at $certPath"

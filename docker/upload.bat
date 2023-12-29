
echo start upload by pscp

pscp -P 13342 -r ../hcms-web flower@121.199.30.10:/usr/local/hcms/dockerfiles/hcmsvue
@REM pscp -P 13342 builddocker.sh flower@121.199.30.10:/usr/local/hcms/dockerfiles/hcmsvue
@REM pscp -P 13342 Dockerfile flower@121.199.30.10:/usr/local/hcms/dockerfiles/hcmsvue
@REM pscp -P 13342 nginx.conf flower@121.199.30.10:/usr/local/hcms/dockerfiles/hcmsvue

pause
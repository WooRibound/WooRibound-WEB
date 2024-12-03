# 프로덕션 빌드용 Dockerfile
FROM --platform=linux/amd64 node:18-alpine
WORKDIR /app

# CA 인증서 설치에 필요한 패키지 설치 (Alpine Linux용)
RUN apk add --no-cache ca-certificates curl

# Root CA 인증서 복사 및 설치 (Alpine Linux용)
COPY root-ca.crt /usr/local/share/ca-certificates/aws-private-ca.crt
RUN update-ca-certificates

# 패키지 설치
COPY package*.json ./
RUN npm install

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# Express 프록시 설정 파일 복사 (이름이 proxy.js인 경우)
COPY proxy.js .
COPY logging.js .

# 서버 실행
EXPOSE 8080
CMD ["node", "proxy.js"]
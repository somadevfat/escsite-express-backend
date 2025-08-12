#FROM centos:7
FROM rockylinux:8
# hostとdockerの日付合わせ
RUN /bin/cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

# パッケージの更新
RUN dnf update -y

# epel リポジトリをinstall
RUN dnf -y install epel-release

RUN dnf -y install nginx logrotate

# ./default.confをコンテナにコピー（default.confにphpのコンテナを指定して、このコンテナとphpのコンテナを接続させる）
COPY ./nginx/conf/default.conf /etc/nginx/conf.d/default.conf

# ログローテ設定
COPY ./nginx/logrotate/nginx /etc/logrotate.d/nginx

# ログローテ設定の権限変更
RUN chmod 644 /etc/logrotate.d/nginx

CMD ["nginx", "-g", "daemon off;"]

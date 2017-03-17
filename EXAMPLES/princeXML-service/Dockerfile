FROM debian:jessie

# Install utilities
RUN apt-get update && apt-get install --assume-yes \
    wget \
    git \
    make \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Install fonts
# NOTE: must enable contrib apt repository for msttcorefonts
# NOTE: must remove bitmap-fonts.conf due to fontconfig bug
RUN sed -i 's/$/ contrib/' /etc/apt/sources.list \
  && apt-get update && apt-get install --assume-yes \
    fontconfig \
    msttcorefonts \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && rm /etc/fonts/conf.d/10-scale-bitmap-fonts.conf

# Install PrinceXML
ENV PRINCE=prince-9.0r5-linux-amd64-static
ENV PRINCE_TAR=$PRINCE.tar.gz
RUN wget http://www.princexml.com/download/$PRINCE_TAR \
  && tar -xzf $PRINCE_TAR \
  && rm $PRINCE_TAR \
  && cd $PRINCE \
  && ./install.sh \
  && cd .. \
  && rm -r $PRINCE

# Install node
ENV NODE_VERSION=4.2.6
RUN git clone https://github.com/tj/n.git n \
  && cd n \
  && make install \
  && n $NODE_VERSION

# Install server
ENV PRINCE_SERVER_VERSION=0.1.2
RUN npm install -g @panosoft/prince-server@$PRINCE_SERVER_VERSION

EXPOSE 8443
ADD . /credentials
CMD ["prince-server", "--key", "/credentials/psx", "--cert", "/credentials/psx.cert", "--port", "8443"]
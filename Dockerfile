FROM python:3.6-buster

RUN pip3 install multiprocess==0.70.9
RUN pip3 install numpy==1.17.2
RUN pip3 install pyrouge==0.1.3
RUN pip3 install torch==1.1.0
RUN pip3 install pytorch-transformers==1.2.0
RUN pip3 install tensorboardX==1.9
RUN pip3 install flask
RUN pip3 install nltk

COPY models /root/presumm/models
COPY src /root/presumm/src
COPY logs /root/presumm/logs
COPY bert_data /root/presumm/bert_data
COPY bert_data_test /root/presumm/bert_data_test



WORKDIR /root/presumm/src
RUN ls
ENTRYPOINT [ "python3.6", "/root/presumm/src/summarizer.py" ]

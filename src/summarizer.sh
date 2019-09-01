#!/bin/bash
# ext
#python train.py -task ext -mode test -test_from ../models/bertext_cnndm/bertext_cnndm_transformer.pt -batch_size 3000 -test_batch_size 500 -bert_data_path ../bert_data/cnndm \
# -log_file ../logs/val_ext_bert_cnndm  -sep_optim true -use_interval true -visible_gpus 3 -max_pos 512 -max_length 200 -alpha 0.95 -min_length 50 -result_path ../logs/ext_bert_cnndm
# abs 
python summarizer.py -task abs -mode test -test_from ../models/bertsumextabs_cnndm/model_step_148000.pt \
  -batch_size 32 -test_batch_size 500 -bert_data_path ../bert_data/cnndm \
 -log_file ../logs/val_abs_bert_cnndm -report_rouge False  -sep_optim true -use_interval true -visible_gpus 3 \
 -max_pos 512 -max_src_nsents 100 -max_length 200 -alpha 0.95 -min_length 50 -result_path ../results/abs_bert_cnndm_sample

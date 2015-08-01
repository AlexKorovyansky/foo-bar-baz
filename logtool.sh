#!/usr/bin/env bash
if [[ "$#" = 1 ]]; then
    wget http://lumber.leanpoker.org/logs/tournament/5592bba01c450b0003000003/team/poker-player-leannodejs/log/$1 --output-document=log.real
    cat log.real
    cat log.real | python replace2.py > parsed.log
    exit
fi
wget http://lumber.leanpoker.org/logs/tournament/5592bba01c450b0003000003/team/poker-player-leannodejs/log --output-document=log.log
link_raw=`tail -4 log.log | head -1`
echo $link_raw
link=${link_raw//'<a href="'/''}
l=`python replace.py $link`
wget http://lumber.leanpoker.org/$l --output-document=log.real
cat log.real | python replace2.py > parsed.log
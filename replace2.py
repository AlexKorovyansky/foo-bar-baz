import sys
import re
for line in sys.stdin:
  print(re.sub('.*bytes=195','',re.sub('.*web.1 -','',line)));
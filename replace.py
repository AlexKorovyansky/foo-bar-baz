import sys
import re
print(re.sub('">.*','',sys.argv[1]));
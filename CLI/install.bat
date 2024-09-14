
if [ "$1" == "install" ]; then
  pip install --user -r requirements.txt
  if [ $? -eq 0 ]; then
    exit 0
  else
    exit 1
  fi
fi

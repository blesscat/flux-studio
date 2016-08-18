#!/usb/bin/env python
# flake8: noqa

from binascii import a2b_base64
from time import sleep
import json
import sys

GAP = 1
TEXT_MESSAGE = json.dumps({"status": "ok", "hello": "Test Message", "Q": 2})
HEXBINARY_MESSAGE = (
'iVBORw0KGgoAAAANSUhEUgAAAQMAAADgCAMAAAAwqPNhAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCA'
'K7OHOkAAAMAUExURQAAAP////////7+/f////////78+dPT0/n5+Orm4f///0EzMEA0MEA1Mf////'
'///0E0Mf///0A1Mf////7+/kA1MdXV1f///0A1Mf///0A1Mfz8/EA1Mf///0A1Mf/////////////'
'//0A1Mf///////0A1Mf7+/v///////0IzMEA1MUA1Mf///////////////0A1Mf////7+/v///9XV'
'1f///0A0MEA1MUE1Mv///////9yhWdXV1dXV1ei9h+GOLOCPMNXV1dXV1eKSNOidRNXU1OSWOOOaQ'
'urPsOunU+SWOPjAcPm3VfrAa/i5W9XV1dXV1dXV1dTU1OWYOrOtqYN8esC9u+Xl5YBbM8zKyPDq5V'
'5UU6x0N8vEvfDw8P////i1UdTU1OKMJ0A1Mfq2UeGLJT4zMDcrKDkuKjgwMP////i0T/39/Pq3Uzs'
'yMN+dRkM4MzwxLfmzSjMoI/+7Ui8jH/r5+UY7N0o/O/WxTv24Ue/u7uaiR/f39k9EQevq6dGAJtva'
'2vTz8+WQKeLh4FRKRoF6eOOfRvCtTebl5Y6IhlxST/Kew8TBwIiBf9jX1+qoS1hOS1NCM3x0cdHOz'
'eueOZ6Zl97d3JmTkM1+JaOenPGoQ9yNnLezsXdvbEs8Mry4tm5mY1xHM++jPuiYM83KyWBWU9SEJ6'
'umpGphXsnGxa+qqfStSGVNNJWNirOvrXNqZ8C8u2NaV+WTLmZdWv/89tuIJtbU0/3gttuYQWubI25'
'UOINiOqijoevd0f736/vPjfm6XfvHenhbOY5pO5djK/7x3v3py8yURpZwPtKXR3ClNfrAa/vXodmf'
'S590PYDCaGaTFbGBQ4HFbOKmTfbv6b+KRNeNNMeMQbmGQqp8QPHm3filyVt2Q3awSuPUxsB4JlBeP'
'nu5XqR6QsWRR0ZJNuaVr4VZLK1vKW6dU3ZRLXJSWaqajNLEt8CxpmaMTfze7IFaZPLC1u6avs6Hma'
'dzhNePrYx8b11GSdyrbpVmdMWDM71/l8F9i8qujI20JdgAAABgdFJOUwAbUhP69A7+BQplFic500k'
'MrtnZOJeS8PjK5SiInbnhcFsv8LbDy0ClfQZbqOXolb1I6yGNZHd5awOChzWFjP3z3dJ1xmXtpnj8'
'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'
'v5/qAbknmUM9g4AAAAASUVORK5CYII=')
BINARY_MESSAGE = a2b_base64(HEXBINARY_MESSAGE)

i = 1
TEXT_HEADER = "t%07x" % len(TEXT_MESSAGE)
BIN_HEADER = "b%07x" % len(BINARY_MESSAGE)
LOOP = len(TEXT_MESSAGE)

while True:
    sys.stderr.write("[LOG] Ready to go\n")

    if i >= len(TEXT_HEADER):
        sys.stdout.write(TEXT_HEADER)
    else:
        sys.stdout.write(TEXT_HEADER[:i])
        sys.stdout.flush()
        sleep(GAP)
        sys.stdout.write(TEXT_HEADER[i:])

    sys.stdout.flush()
    sys.stderr.write("[LOG] Text message header sent\n")

    if i >= len(TEXT_MESSAGE):
        sys.stdout.write(TEXT_MESSAGE)
    else:
        sys.stdout.write(TEXT_MESSAGE[:i])
        sys.stdout.flush()
        sleep(GAP)
        sys.stdout.write(TEXT_MESSAGE[i:])

    sys.stdout.flush()
    sys.stderr.write("[LOG] Text message sent\n")


    sys.stderr.write("[LOG] Binary message header sent\n")

    if i >= len(BIN_HEADER):
        sys.stdout.write(BIN_HEADER)
    else:
        sys.stdout.write(BIN_HEADER[:i])
        sleep(GAP)
        sys.stdout.write(BIN_HEADER[i:])

    sys.stdout.flush()
    sys.stderr.write("[LOG] Binary message header sent\n")

    sys.stdout.write(BINARY_MESSAGE[:123])
    sys.stdout.flush()
    sleep(GAP)
    sys.stdout.write(BINARY_MESSAGE[123:])
    sys.stderr.write("[LOG] Binary message sent\n")

    i += 1
    if i > len(TEXT_MESSAGE):
        i = 1


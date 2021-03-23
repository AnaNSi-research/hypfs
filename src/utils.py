from datetime import datetime
import requests
from src.parameters import *

NODES = 2 ** HYPERCUBE_SIZE
INSERT = 'insert'
REMOVE = 'remove'
PIN_SEARCH = 'pin_search'
SUPERSET_SEARCH = 'superset_search'


def request(neighbor, operation, params):
    url = "http://{}:{}/{}".format(LOCAL_HOST, str(int(neighbor, 2) + INIT_PORT), operation)
    return requests.get(url=url, params=params)


def create_binary_id(n):
    binary_id = bin(n)[2:]
    while len(binary_id) < HYPERCUBE_SIZE:
        binary_id = '0' + binary_id
    return binary_id


def one(bit):
    n = int(bit, 2)
    return sorted([i for i in range(0, len(bit)) if n & (1 << i)], reverse=True)


def zero(bit):
    n = int(bit, 2)
    return sorted([i for i in range(0, len(bit)) if not n & (1 << i)], reverse=True)


def b1_in_b2(b1, b2):
    if all(bit in one(b2) for bit in one(b1)):
        return True
    else:
        return False


def hamming_distance(n1, n2):
    x = n1 ^ n2
    set_bits = 0
    while x > 0:
        set_bits += x & 1
        x >>= 1
    return set_bits


def log(tid, operation, msg):
    log_line = "> {} - [{}] -> [{}]: {:20}".format(datetime.now().strftime("%Y/%m/%d %H:%M:%S"), tid, operation.upper(), msg)
    print(log_line)

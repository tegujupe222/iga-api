import argparse
import sys
from scraper import main, run_cron

def parse_args():
    parser = argparse.ArgumentParser(description='TokyoDisneyResort Scraper CLI')
    parser.add_argument('--park', type=str, help='land or sea')
    parser.add_argument('--type', type=str, help='standby or fastpass')
    parser.add_argument('--cron', action='store_true', help='Run in scheduled mode')
    return parser.parse_args()

if __name__ == '__main__':
    args = parse_args()
    if args.cron:
        run_cron()
    elif args.park and args.type:
        main(args.park, args.type)
    else:
        print('Usage: cli.py --park land --type standby | --cron')
        sys.exit(1) 
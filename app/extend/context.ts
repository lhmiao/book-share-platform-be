import SHA256 from 'crypto-js/sha256';

interface ChainBlock {
  prevHash: string;
  timestamp: number;
  data: string;
  hash: string;
}

export class Chain {
  constructor(recordChain?: ChainBlock[]) {
    if (recordChain) {
      this.recordChain = recordChain;
    }
  }

  private recordChain: ChainBlock[] = [];

  addBlock(data: string) {
    let prevHash: string = '';
    const prevBlock = this.getLastBlock();
    if (prevBlock) prevHash = prevBlock.hash;
    const timestamp = Date.now();
    const hash = this.calculateHash(prevHash, timestamp, data);
    this.recordChain.push({ prevHash, timestamp, data, hash });
  }

  calculateHash(prevHash: string, timestamp: number, data: string): string {
    return SHA256(`${prevHash}${timestamp}${data}`).toString();
  }

  getLastBlock(): ChainBlock|undefined {
    const { length } = this.recordChain;
    if (length) return this.recordChain[length - 1];
    return undefined;
  }

  getValue(): ChainBlock[] {
    return this.recordChain;
  }
}

const { Writable, Readable } = require('stream')

class WriteStream extends Writable {
    constructor() {
        super();
        this.buff = []
    }
    write(chunck) {
        this.buff.push(chunck)
    }

    getBuffer() {
        return Buffer.concat(this.buff).toString()
    }
}

class ReadStream extends Readable {
    constructor() {
        super();
        this.buff = Buffer.from('test string')
        this.size = 1;
        this.offset = 0;
    }
    _read() {
        const data = this.buff.slice(this.offset, this.offset + this.size);
        this.offset += this.size;
        this.push(data.length ? data : undefined)
    }
}

const handleAsync = () => new Promise((r, j) => {
    const writable = new WriteStream();
    const readable = new ReadStream();
    readable.pipe(writable);
    readable.on('end', () => {
        r(writable.getBuffer())
    })
    readable.on('error', (err) => {
        j(err)
    })
})

const main = async () => {
    try {
        console.log(await handleAsync())
    } catch (err) {
        console.log(err)
    }
}

main();
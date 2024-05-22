export var HEAD_SIZE = 8;

function encodeText(str) {
	return unescape(encodeURIComponent(str)).split("").map(val => val.charCodeAt());
}

function decodeText(arrbuff) {
	return decodeURIComponent(escape(String.fromCharCode(...new Uint8Array(arrbuff))));
}

class NetPack {
  offset = 0;

  /**
   * 
   * @param {ArrayBuffer} u 
   */
  constructor(u) {
    this._buff = new DataView(u);
  }

  /**
   * 
   * @param {ArrayBuffer} u 
   */
  static fromPack(u) {
    let p = new NetPack(u)
    return p
  }

  /**
   * 
   * @returns {NetPack}
   */
  static newPack() {
    let u = new ArrayBuffer(256);
    let p = new NetPack(u);
    p.offset = HEAD_SIZE;
    return p;
  }

  readInt32() {
    if (this.offset + 4 > this._buff.byteLength) {
      return 0
    }
    let v = this._buff.getInt32(this.offset, true);
    this.offset += 4;
    return v;
  }
  
  readInt64() {
    if (this.offset + 8 > this._buff.byteLength) {
      return 0
    }
    let v = this._buff.getBigInt64(this.offset, true);
    this.offset += 8;
    return v;
  }

  /**
   * 
   * @returns {String}
   */
  readString() {
    let len = this.readInt32();
    if (len === 0) {
      return "";
    }
    if (this.offset + len > this._buff.buffer.byteLength) {
      return "";
    }
    // let s = new TextDecoder("utf-8").decode(this._buff.buffer.slice(this.offset, this.offset + len));
	let s = decodeText(this._buff.buffer.slice(this.offset, this.offset + len));
    this.offset += len;
    return s;
  }

  /**
   * 
   * @returns {String}
   */
  readBuffString() {
	// let buff = this._buff.buffer.slice(this.offset);
	let s = decodeText(this._buff.buffer.slice(this.offset));
    // return new TextDecoder("utf-8").decode(this._buff.buffer.slice(this.offset));
	return s;
  }
  
  /**
   * 
   * @returns {Object}
   */
  readJsonObject() {
	var s = this.readBuffString()
    return JSON.parse(s);
  }

  /**
   * 
   * @param {Number} pid 
   * @returns {ArrayBuffer}
   */
  decode(pid) {
    this._buff.setInt32(0, this.offset, true);
    this._buff.setInt32(4, pid, true);
    return this._buff.buffer.slice(0, this.offset);
  }

  _checkExpand(len) {
    let needlen = this.offset + len;
    if (needlen > this._buff.buffer.byteLength) {
      let newlen = needlen > this._buff.buffer.byteLength * 2 ? needlen : this._buff.buffer.byteLength * 2;
      let nb = new ArrayBuffer(newlen);
      new Uint8Array(nb).set(new Uint8Array(this._buff.buffer), 0);
      this._buff = new DataView(nb);
    }
  }

  writeInt32(v) {
    this._checkExpand(4);
    this._buff.setInt32(this.offset, v, true);
    this.offset += 4;
  }
  
  writeInt64(v) {
    this._checkExpand(8);
    this._buff.setBigInt64(this.offset, BigInt(v), true);
    this.offset += 8;
  }

  /**
   * 
   * @param {String} s 
   */
  writeString(s) {
    // let encoder = new TextEncoder();
    // let encodedString = encoder.encode(s);
	let encodedString = encodeText(s);
    this._checkExpand(4 + encodedString.byteLength)
    this.writeInt32(encodedString.length);
    new Uint8Array(this._buff.buffer).set(encodedString, this.offset);
    this.offset += encodedString.length;
  }

  /**
   * 
   * @param {String} s 
   */
  writeBufferString(s) {
    // let encoder = new TextEncoder();
    // let encodedString = encoder.encode(s);
	let encodedString = encodeText(s);
    this._checkExpand(encodedString.length)
    new Uint8Array(this._buff.buffer).set(encodedString, this.offset);
    this.offset += encodedString.length;
  }

  writeJsonObject(v) {
    let s = JSON.stringify(v)
    this.writeBufferString(s)
  }
}

export default NetPack;
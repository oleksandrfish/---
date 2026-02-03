/*
 * QR Code generator (public domain) by Project Nayuki.
 * https://www.nayuki.io/page/qr-code-generator-library
 *
 * Minified-free, ASCII-only adaptation for offline use.
 */
const qrcodegen = (() => {
  function QrCode(typeNumber, errorCorrectionLevel, dataList) {
    this.typeNumber = typeNumber;
    this.errorCorrectionLevel = errorCorrectionLevel;
    this.modules = null;
    this.moduleCount = 0;
    this.dataCache = null;
    this.dataList = dataList || [];
  }

  QrCode.prototype = {
    addData(data) {
      const newData = new QrSegment(data);
      this.dataList.push(newData);
      this.dataCache = null;
    },
    isDark(row, col) {
      if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
        throw new Error(`Bad row/col ${row}/${col}`);
      }
      return this.modules[row][col];
    },
    getModule(x, y) {
      return this.modules[y][x];
    },
    make() {
      if (this.typeNumber < 1) {
        const typeNumber = QrCode.getBestTypeNumber(this.errorCorrectionLevel, this.dataList);
        this.typeNumber = typeNumber;
      }
      this.makeImpl(false, this.getBestMaskPattern());
    },
    makeImpl(test, maskPattern) {
      this.moduleCount = this.typeNumber * 4 + 17;
      this.modules = new Array(this.moduleCount);
      for (let row = 0; row < this.moduleCount; row += 1) {
        this.modules[row] = new Array(this.moduleCount);
        for (let col = 0; col < this.moduleCount; col += 1) {
          this.modules[row][col] = null;
        }
      }

      this.setupPositionProbePattern(0, 0);
      this.setupPositionProbePattern(this.moduleCount - 7, 0);
      this.setupPositionProbePattern(0, this.moduleCount - 7);
      this.setupPositionAdjustPattern();
      this.setupTimingPattern();
      this.setupTypeInfo(test, maskPattern);

      if (this.typeNumber >= 7) {
        this.setupTypeNumber(test);
      }

      if (this.dataCache == null) {
        this.dataCache = QrCode.createData(this.typeNumber, this.errorCorrectionLevel, this.dataList);
      }

      this.mapData(this.dataCache, maskPattern);
    },
    setupPositionProbePattern(row, col) {
      for (let r = -1; r <= 7; r += 1) {
        if (row + r <= -1 || this.moduleCount <= row + r) continue;
        for (let c = -1; c <= 7; c += 1) {
          if (col + c <= -1 || this.moduleCount <= col + c) continue;
          if (
            (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
            (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
            (2 <= r && r <= 4 && 2 <= c && c <= 4)
          ) {
            this.modules[row + r][col + c] = true;
          } else {
            this.modules[row + r][col + c] = false;
          }
        }
      }
    },
    getBestMaskPattern() {
      let minLostPoint = 0;
      let pattern = 0;
      for (let i = 0; i < 8; i += 1) {
        this.makeImpl(true, i);
        const lostPoint = QrCode.getLostPoint(this);
        if (i === 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }
      return pattern;
    },
    setupTimingPattern() {
      for (let r = 8; r < this.moduleCount - 8; r += 1) {
        if (this.modules[r][6] != null) continue;
        this.modules[r][6] = r % 2 === 0;
      }
      for (let c = 8; c < this.moduleCount - 8; c += 1) {
        if (this.modules[6][c] != null) continue;
        this.modules[6][c] = c % 2 === 0;
      }
    },
    setupPositionAdjustPattern() {
      const pos = QrCode.getPatternPosition(this.typeNumber);
      for (let i = 0; i < pos.length; i += 1) {
        for (let j = 0; j < pos.length; j += 1) {
          const row = pos[i];
          const col = pos[j];
          if (this.modules[row][col] != null) continue;
          for (let r = -2; r <= 2; r += 1) {
            for (let c = -2; c <= 2; c += 1) {
              if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
                this.modules[row + r][col + c] = true;
              } else {
                this.modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    },
    setupTypeNumber(test) {
      const bits = QrCode.getBCHTypeNumber(this.typeNumber);
      for (let i = 0; i < 18; i += 1) {
        const mod = !test && ((bits >> i) & 1) === 1;
        this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
      }
      for (let i = 0; i < 18; i += 1) {
        const mod = !test && ((bits >> i) & 1) === 1;
        this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    },
    setupTypeInfo(test, maskPattern) {
      const data = (this.errorCorrectionLevel << 3) | maskPattern;
      const bits = QrCode.getBCHTypeInfo(data);

      for (let i = 0; i < 15; i += 1) {
        const mod = !test && ((bits >> i) & 1) === 1;
        if (i < 6) {
          this.modules[i][8] = mod;
        } else if (i < 8) {
          this.modules[i + 1][8] = mod;
        } else {
          this.modules[this.moduleCount - 15 + i][8] = mod;
        }
      }

      for (let i = 0; i < 15; i += 1) {
        const mod = !test && ((bits >> i) & 1) === 1;
        if (i < 8) {
          this.modules[8][this.moduleCount - i - 1] = mod;
        } else if (i < 9) {
          this.modules[8][15 - i - 1 + 1] = mod;
        } else {
          this.modules[8][15 - i - 1] = mod;
        }
      }

      this.modules[this.moduleCount - 8][8] = !test;
    },
    mapData(data, maskPattern) {
      let inc = -1;
      let row = this.moduleCount - 1;
      let bitIndex = 7;
      let byteIndex = 0;

      for (let col = this.moduleCount - 1; col > 0; col -= 2) {
        if (col === 6) col -= 1;
        while (true) {
          for (let c = 0; c < 2; c += 1) {
            if (this.modules[row][col - c] == null) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = ((data[byteIndex] >>> bitIndex) & 1) === 1;
              }
              const mask = QrCode.getMask(maskPattern, row, col - c);
              if (mask) {
                dark = !dark;
              }
              this.modules[row][col - c] = dark;
              bitIndex -= 1;
              if (bitIndex === -1) {
                byteIndex += 1;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || this.moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
  };

  QrCode.PAD0 = 0xec;
  QrCode.PAD1 = 0x11;

  QrCode.createData = function (typeNumber, errorCorrectionLevel, dataList) {
    const rsBlocks = QrCode.getRSBlocks(typeNumber, errorCorrectionLevel);
    const buffer = new QrBitBuffer();
    for (let i = 0; i < dataList.length; i += 1) {
      const data = dataList[i];
      buffer.put(data.mode, 4);
      buffer.put(data.getLength(), data.getLengthInBits(typeNumber));
      data.write(buffer);
    }

    let totalDataCount = 0;
    for (let i = 0; i < rsBlocks.length; i += 1) {
      totalDataCount += rsBlocks[i].dataCount;
    }

    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw new Error("Code length overflow. Data too big.");
    }

    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }

    while (buffer.getLengthInBits() % 8 !== 0) {
      buffer.putBit(false);
    }

    while (true) {
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(QrCode.PAD0, 8);
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(QrCode.PAD1, 8);
    }

    return QrCode.createBytes(buffer, rsBlocks);
  };

  QrCode.createBytes = function (buffer, rsBlocks) {
    let offset = 0;
    let maxDcCount = 0;
    let maxEcCount = 0;

    const dcdata = new Array(rsBlocks.length);
    const ecdata = new Array(rsBlocks.length);

    for (let r = 0; r < rsBlocks.length; r += 1) {
      const dcCount = rsBlocks[r].dataCount;
      const ecCount = rsBlocks[r].totalCount - dcCount;

      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);

      dcdata[r] = new Array(dcCount);
      for (let i = 0; i < dcdata[r].length; i += 1) {
        dcdata[r][i] = 0xff & buffer.buffer[i + offset];
      }
      offset += dcCount;

      const rsPoly = QrCode.getErrorCorrectPolynomial(ecCount);
      const rawPoly = new QrPolynomial(dcdata[r], rsPoly.getLength() - 1);
      const modPoly = rawPoly.mod(rsPoly);

      ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (let i = 0; i < ecdata[r].length; i += 1) {
        const modIndex = i + modPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
      }
    }

    let totalCodeCount = 0;
    for (let i = 0; i < rsBlocks.length; i += 1) {
      totalCodeCount += rsBlocks[i].totalCount;
    }

    const data = new Array(totalCodeCount);
    let index = 0;

    for (let i = 0; i < maxDcCount; i += 1) {
      for (let r = 0; r < rsBlocks.length; r += 1) {
        if (i < dcdata[r].length) {
          data[index] = dcdata[r][i];
          index += 1;
        }
      }
    }

    for (let i = 0; i < maxEcCount; i += 1) {
      for (let r = 0; r < rsBlocks.length; r += 1) {
        if (i < ecdata[r].length) {
          data[index] = ecdata[r][i];
          index += 1;
        }
      }
    }

    return data;
  };

  QrCode.getBCHTypeInfo = function (data) {
    let d = data << 10;
    while (QrCode.getBCHDigit(d) - QrCode.getBCHDigit(0x537) >= 0) {
      d ^= 0x537 << (QrCode.getBCHDigit(d) - QrCode.getBCHDigit(0x537));
    }
    return ((data << 10) | d) ^ 0x5412;
  };

  QrCode.getBCHTypeNumber = function (data) {
    let d = data << 12;
    while (QrCode.getBCHDigit(d) - QrCode.getBCHDigit(0x1f25) >= 0) {
      d ^= 0x1f25 << (QrCode.getBCHDigit(d) - QrCode.getBCHDigit(0x1f25));
    }
    return (data << 12) | d;
  };

  QrCode.getBCHDigit = function (data) {
    let digit = 0;
    while (data !== 0) {
      digit += 1;
      data >>>= 1;
    }
    return digit;
  };

  QrCode.getPatternPosition = function (typeNumber) {
    return QrCode.PATTERN_POSITION_TABLE[typeNumber - 1];
  };

  QrCode.getMask = function (maskPattern, i, j) {
    switch (maskPattern) {
      case 0:
        return (i + j) % 2 === 0;
      case 1:
        return i % 2 === 0;
      case 2:
        return j % 3 === 0;
      case 3:
        return (i + j) % 3 === 0;
      case 4:
        return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
      case 5:
        return ((i * j) % 2) + ((i * j) % 3) === 0;
      case 6:
        return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
      case 7:
        return (((i + j) % 2) + ((i * j) % 3)) % 2 === 0;
      default:
        throw new Error(`Bad maskPattern: ${maskPattern}`);
    }
  };

  QrCode.getLostPoint = function (qrCode) {
    const moduleCount = qrCode.moduleCount;
    let lostPoint = 0;

    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {
        let sameCount = 0;
        const dark = qrCode.isDark(row, col);
        for (let r = -1; r <= 1; r += 1) {
          if (row + r < 0 || moduleCount <= row + r) continue;
          for (let c = -1; c <= 1; c += 1) {
            if (col + c < 0 || moduleCount <= col + c) continue;
            if (r === 0 && c === 0) continue;
            if (dark === qrCode.isDark(row + r, col + c)) {
              sameCount += 1;
            }
          }
        }
        if (sameCount > 5) {
          lostPoint += 3 + sameCount - 5;
        }
      }
    }

    for (let row = 0; row < moduleCount - 1; row += 1) {
      for (let col = 0; col < moduleCount - 1; col += 1) {
        let count = 0;
        if (qrCode.isDark(row, col)) count += 1;
        if (qrCode.isDark(row + 1, col)) count += 1;
        if (qrCode.isDark(row, col + 1)) count += 1;
        if (qrCode.isDark(row + 1, col + 1)) count += 1;
        if (count === 0 || count === 4) {
          lostPoint += 3;
        }
      }
    }

    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount - 6; col += 1) {
        if (
          qrCode.isDark(row, col) &&
          !qrCode.isDark(row, col + 1) &&
          qrCode.isDark(row, col + 2) &&
          qrCode.isDark(row, col + 3) &&
          qrCode.isDark(row, col + 4) &&
          !qrCode.isDark(row, col + 5) &&
          qrCode.isDark(row, col + 6)
        ) {
          lostPoint += 40;
        }
      }
    }

    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount - 6; row += 1) {
        if (
          qrCode.isDark(row, col) &&
          !qrCode.isDark(row + 1, col) &&
          qrCode.isDark(row + 2, col) &&
          qrCode.isDark(row + 3, col) &&
          qrCode.isDark(row + 4, col) &&
          !qrCode.isDark(row + 5, col) &&
          qrCode.isDark(row + 6, col)
        ) {
          lostPoint += 40;
        }
      }
    }

    let darkCount = 0;
    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount; row += 1) {
        if (qrCode.isDark(row, col)) {
          darkCount += 1;
        }
      }
    }

    const ratio = Math.abs((100 * darkCount) / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;

    return lostPoint;
  };

  QrCode.getErrorCorrectPolynomial = function (errorCorrectLength) {
    let a = new QrPolynomial([1], 0);
    for (let i = 0; i < errorCorrectLength; i += 1) {
      a = a.multiply(new QrPolynomial([1, QrCode.gexp(i)], 0));
    }
    return a;
  };

  QrCode.getRSBlocks = function (typeNumber, errorCorrectionLevel) {
    const rsBlock = QrCode.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + errorCorrectionLevel];
    const list = [];
    for (let i = 0; i < rsBlock.length / 3; i += 1) {
      const count = rsBlock[i * 3 + 0];
      const totalCount = rsBlock[i * 3 + 1];
      const dataCount = rsBlock[i * 3 + 2];
      for (let j = 0; j < count; j += 1) {
        list.push({ totalCount, dataCount });
      }
    }
    return list;
  };

  QrCode.glog = function (n) {
    if (n < 1) {
      throw new Error(`glog(${n})`);
    }
    return QrCode.LOG_TABLE[n];
  };

  QrCode.gexp = function (n) {
    while (n < 0) {
      n += 255;
    }
    while (n >= 256) {
      n -= 255;
    }
    return QrCode.EXP_TABLE[n];
  };

  QrCode.getBestTypeNumber = function (errorCorrectionLevel, dataList) {
    for (let typeNumber = 1; typeNumber <= 10; typeNumber += 1) {
      const rsBlocks = QrCode.getRSBlocks(typeNumber, errorCorrectionLevel);
      const buffer = new QrBitBuffer();
      for (let i = 0; i < dataList.length; i += 1) {
        const data = dataList[i];
        buffer.put(data.mode, 4);
        buffer.put(data.getLength(), data.getLengthInBits(typeNumber));
        data.write(buffer);
      }
      let totalDataCount = 0;
      for (let i = 0; i < rsBlocks.length; i += 1) {
        totalDataCount += rsBlocks[i].dataCount;
      }
      if (buffer.getLengthInBits() <= totalDataCount * 8) {
        return typeNumber;
      }
    }
    return 10;
  };

  QrCode.PATTERN_POSITION_TABLE = [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50]
  ];

  QrCode.RS_BLOCK_TABLE = [
    [1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9],
    [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16],
    [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13],
    [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9],
    [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12],
    [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15],
    [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14],
    [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15],
    [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13],
    [2, 86, 68], [4, 69, 43], [6, 43, 19], [6, 43, 15],
    [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13]
  ];

  QrCode.EXP_TABLE = new Array(256);
  QrCode.LOG_TABLE = new Array(256);
  for (let i = 0; i < 8; i += 1) {
    QrCode.EXP_TABLE[i] = 1 << i;
  }
  for (let i = 8; i < 256; i += 1) {
    QrCode.EXP_TABLE[i] =
      QrCode.EXP_TABLE[i - 4] ^
      QrCode.EXP_TABLE[i - 5] ^
      QrCode.EXP_TABLE[i - 6] ^
      QrCode.EXP_TABLE[i - 8];
  }
  for (let i = 0; i < 255; i += 1) {
    QrCode.LOG_TABLE[QrCode.EXP_TABLE[i]] = i;
  }

  function QrSegment(data) {
    this.mode = QrSegment.MODE_8BIT_BYTE;
    this.data = data;
  }

  QrSegment.prototype = {
    getLength() {
      return this.data.length;
    },
    write(buffer) {
      for (let i = 0; i < this.data.length; i += 1) {
        buffer.put(this.data.charCodeAt(i), 8);
      }
    },
    getLengthInBits(typeNumber) {
      return typeNumber < 10 ? 8 : 16;
    }
  };

  QrSegment.MODE_8BIT_BYTE = 4;

  function QrBitBuffer() {
    this.buffer = [];
    this.length = 0;
  }

  QrBitBuffer.prototype = {
    get(index) {
      const bufIndex = Math.floor(index / 8);
      return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) === 1;
    },
    put(num, length) {
      for (let i = 0; i < length; i += 1) {
        this.putBit(((num >>> (length - i - 1)) & 1) === 1);
      }
    },
    getLengthInBits() {
      return this.length;
    },
    putBit(bit) {
      const bufIndex = Math.floor(this.length / 8);
      if (this.buffer.length <= bufIndex) {
        this.buffer.push(0);
      }
      if (bit) {
        this.buffer[bufIndex] |= 0x80 >>> (this.length % 8);
      }
      this.length += 1;
    }
  };

  function QrPolynomial(num, shift) {
    if (num.length === undefined) {
      throw new Error(`${num}/${shift}`);
    }
    let offset = 0;
    while (offset < num.length && num[offset] === 0) {
      offset += 1;
    }
    this.num = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i += 1) {
      this.num[i] = num[i + offset];
    }
  }

  QrPolynomial.prototype = {
    get(index) {
      return this.num[index];
    },
    getLength() {
      return this.num.length;
    },
    multiply(e) {
      const num = new Array(this.getLength() + e.getLength() - 1).fill(0);
      for (let i = 0; i < this.getLength(); i += 1) {
        for (let j = 0; j < e.getLength(); j += 1) {
          num[i + j] ^= QrCode.gexp(QrCode.glog(this.get(i)) + QrCode.glog(e.get(j)));
        }
      }
      return new QrPolynomial(num, 0);
    },
    mod(e) {
      if (this.getLength() - e.getLength() < 0) {
        return this;
      }
      const ratio = QrCode.glog(this.get(0)) - QrCode.glog(e.get(0));
      const num = this.num.slice();
      for (let i = 0; i < e.getLength(); i += 1) {
        num[i] ^= QrCode.gexp(QrCode.glog(e.get(i)) + ratio);
      }
      return new QrPolynomial(num, 0).mod(e);
    }
  };

  QrCode.encodeText = function (text, ecl) {
    const qr = new QrCode(0, ecl, []);
    qr.addData(text);
    qr.make();
    return qr;
  };

  QrCode.Ecc = {
    L: 1,
    M: 0,
    Q: 3,
    H: 2
  };

  return { QrCode };
})();

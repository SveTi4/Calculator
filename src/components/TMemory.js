const MemoryCommand = {
    Store: 'Store',
    Add: 'Add',
    Clear: 'Clear',
    Copy: 'Copy'
};

const MemoryState = {
    _On: '_On',
    _Off: '_Off'
};

class TMemory {
    constructor(NumberClass) {
        if (!NumberClass) {
            throw new Error('NumberClass is required');
        }
        this.NumberClass = NumberClass;
        this.FNumber = new NumberClass(0);
        this.FState = MemoryState._Off;
    }

    get value() {
        return this.FNumber;
    }

    get hasValue() {
        return this.FState === MemoryState._On;
    }

    edit(command, number) {
        if (!command || !MemoryCommand[command]) {
            throw new Error(`Invalid command: ${command}`);
        }

        switch (command) {
            case MemoryCommand.Store:
                if (!number) {
                    throw new Error('Number is required for Store command');
                }
                this.FNumber = number;
                this.FState = MemoryState._On;
                return [this.FNumber, this.hasValue];

            case MemoryCommand.Add:
                if (!number) {
                    throw new Error('Number is required for Add command');
                }
                if (this.FState === MemoryState._Off) {
                    this.FNumber = number;
                } else {
                    this.FNumber = this.FNumber.add(number);
                }
                this.FState = MemoryState._On;
                return [this.FNumber, this.hasValue];

            case MemoryCommand.Clear:
                this.FNumber = new this.NumberClass(0);
                this.FState = MemoryState._Off;
                return [this.FNumber, this.hasValue];

            case MemoryCommand.Copy:
                if (this.FState === MemoryState._Off) {
                    return [new this.NumberClass(0), this.hasValue];
                }
                return [this.FNumber, this.hasValue];

            default:
                throw new Error(`Unknown command: ${command}`);
        }
    }
}

module.exports = { TMemory, MemoryCommand, MemoryState }; 
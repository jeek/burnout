/** @param {NS} ns */

// Hash function by @Insight from the Bitburner Discord
export function hashCode(s) {
	return s.split("").reduce(
		function (a, b) {
			a = ((a << 5) - a) + b.charCodeAt(0);
			return a & a;
		}, 0
	);
}

// Write the content to the file if it's different than what is already there
async function writeIfNotSame(ns, filename, content) {
	if (ns.read(filename) != content) {
		await ns.write(filename, content, 'w');
	}
}

// Generates a very-very-likely to be unique ID.
export function uniqueID(s, random = false) {
	let answer = "";
	let remainder = "";
	if (random) {
        remainder = Math.floor(1e30 * Math.random());
	} else {
		remainder = hashCode(s);
	}
	if (remainder < 0) {
		remainder = -remainder;
	}
	while (remainder > 0) {
		answer = answer + "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-"[remainder % 64];
		remainder = Math.floor(remainder / 64);
	}
	return answer;
}

// Writes a command to a file, runs it, and then returns the result
export async function Do(ns, command, ...args) {
	await writeIfNotSame(ns, '/temp/rm.js', `export async function main(ns) {ns.rm(ns.args[0], 'home');}`);
	let progname = "/temp/proc-" + uniqueID(command);
	let procid = progname + uniqueID(JSON.stringify(...args), true) + ".txt";
	if ((await ns.read(progname + ".js")).length == 0) {
		await writeIfNotSame(ns, progname + ".js", `export async function main(ns) { ns.write(ns.args.shift(), JSON.stringify(` + command + `(...JSON.parse(ns.args[0]))), 'w'); }`);
	}
	while (0 == ns.run(progname + ".js", 1, procid, JSON.stringify(args))) {
		await ns.sleep(0);
	}
	let answer = ns.read(procid);
	let good = false;
	while (!good) {
		await ns.sleep(0);
		try {
			answer = JSON.parse(ns.read(procid));
			good = true;
		} catch { }
	}
	while (0 == ns.run('/temp/rm.js', 1, procid)) { await ns.sleep(0) };
	return answer;
}

export class Server {
    constructor(ns, name = "home") {
		this.ns = ns;
        this.name = name;
    }
    get backdoorInstalled() {
        return (async () => {
			try {
				return (await Do(this.ns, "ns.getServer", this.name)).backdoorInstalled;
			} catch(e) {
				return false;
			}
		})();
    }
    get baseDifficulty() {
        return (async () => {
			try {
				return await Do(this.ns, "ns.getServerBaseSecurityLevel", this.name);
			} catch(e) {
				return false;
			}
		})();
    }
    get cpuCores() {
        return (async () => {
			try {
				return (await Do(this.ns, "ns.getServer", this.name)).cpuCores;
			} catch(e) {
				return false;
			}
		})();
    }
	get ftpPortOpen() {
        return (async () => {
			try {
				return (await Do(this.ns, "ns.getServer", this.name)).ftpPortOpen;
			} catch(e) {
				return false;
			}
		})();
	}
	get hackDifficulty() {
		return (async () => {
			try {
				return await Do(this.ns, "ns.getServerSecurityLevel", this.name);
			} catch(e) {
				return -1;
			}
		})();
	}
	get hasAdminRights() {
		return (async () => {
			try {
				return await Do(this.ns, "ns.hasRootAccess", this.name);
			} catch(e) {
				return false;
			}
		})();
	}
	get hostname() {
		return this.name;
	}
	get httpPortOpen() {
        return (async () => {
			try {
				return (await Do(this.ns, "ns.getServer", this.name)).httpPortOpen;
			} catch(e) {
				return false;
			}
		})();
	}
	get ip() {
        return (async () => {
			try {
				return (await Do(this.ns, "ns.getServer", this.name)).ip;
			} catch(e) {
				return "0.0.0.0";
			}
		})();
	}
	get isConnectedTo() {
        return (async () => {
			try {
				return (await Do(this.ns, "ns.getServer", this.name)).isConnectedTo;
			} catch(e) {
				return "0.0.0.0";
			}
		})();
	}
    get maxRam() {
		return (async () => {
			try {
				return await Do(this.ns, "ns.getServerMaxRam", this.name);
			} catch(e) {
				return -1;
			}
		})();
    }
    get minDifficulty() {
		return (async () => {
			try {
				return await Do(this.ns, "ns.getServerMinSecurityLevel", this.name);
			} catch(e) {
				return -1;
			}
		})();
    }
    get moneyAvailable() {
		return (async () => {
			try {
				return await Do(this.ns, "ns.getServerMoneyAvailable", this.name);
			} catch(e) {
				return -1;
			}
		})();
    }
    get moneyMax() {
		return (async () => {
			try {
				return await Do(this.ns, "ns.getServerMaxMoney", this.name);
			} catch(e) {
				return -1;
			}
		})();
    }
	get numOpenPortsRequired() {
        return (async () => {
			try {
				return (await Do(this.ns, "ns.getServer", this.name)).numOpenPortsRequired;
			} catch(e) {
				return 6;
			}
		})();
	}
	get openPortCount() {
        return (async () => {
			try {
				return (await Do(this.ns, "ns.getServer", this.name)).openPortCount;
			} catch(e) {
				return -1;
			}
		})();
	}
	get purchasedByPlayer() {
        return (async () => {
			try {
				return (await Do(this.ns, "ns.getServer", this.name)).purchasedByPlayer;
			} catch(e) {
				return -1;
			}
		})();
	}
    get ramUsed() {
		return (async () => {
			try {
				return await Do(this.ns, "ns.getServerUsedRam", this.name);
			} catch(e) {
				return -1;
			}
		})();
    }
    get requiredHackingSkill() {
		return (async () => {
			try {
				return await Do(this.ns, "ns.getServerRequiredHackingLevel", this.name);
			} catch(e) {
				return -1;
			}
		})();
    }
    get serverGrowth() {
		return (async () => {
			try {
				return await Do(this.ns, "ns.getServerGrowth", this.name);
			} catch(e) {
				return -1;
			}
		})();
    }
	get smtpPortOpen() {
        return (async () => {
			try {
				return (await Do(this.ns, "ns.getServer", this.name)).smtpPortOpen;
			} catch(e) {
				return false;
			}
		})();
	}
	get sqlPortOpen() {
        return (async () => {
			try {
				return (await Do(this.ns, "ns.getServer", this.name)).smtpPortOpen;
			} catch(e) {
				return false;
			}
		})();
	}
	get sshPortOpen() {
        return (async () => {
			try {
				return (await Do(this.ns, "ns.getServer", this.name)).sshPortOpen;
			} catch(e) {
				return false;
			}
		})();
	}
}

export class CacheServer {
    constructor(ns, name = "home") {
		this.ns = ns;
        this.name = name;
		this.server = new Server(ns, this.name);
	}
	async init() {
		this.backdoorInstalled = await this.server.backdoorInstalled;
		this.baseDifficulty = await this.server.baseDifficulty;
		this.cpuCores = await this.server.cpuCores;
		this.ftpPortOpen = await this.server.ftpPortOpen;
		this.hackDifficulty = await this.server.hackDifficulty;
		this.hasAdminRights = await this.server.hasAdminRights;
		this.hostname = await this.server.hostname;
		this.httpPortOpen = await this.server.httpPortOpen;
		this.ip = await this.server.ip;
		this.isConnectedTo = await this.server.isConnectedTo;
		this.maxRam = await this.server.maxRam;
		this.minDifficulty = await this.server.minDifficulty;
		this.moneyAvailable = await this.server.moneyAvailable;
		this.moneyMax = await this.server.moneyMax;
		this.numOpenPortsRequired = await this.server.numOpenPortsRequired;
		this.openPortCount = await this.server.openPortCount;
		this.organizationName = await this.server.organizationName;
		this.purchasedByPlayer = await this.server.purchasedByPlayer;
		this.ramUsed = await this.server.ramUsed;
		this.requiredHackingSkill = await this.server.requiredHackingSkill;
		this.serverGrowth = await this.server.serverGrowth;
		this.smtpPortOpen = await this.server.smtpPortOpen;
		this.sqlPortOpen = await this.server.sqlPortOpen;
		this.sshPortOpen = await this.server.sshPortOpen;
    }
}
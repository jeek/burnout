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

class Corp {

	// Janaszar - https://discord.com/channels/415207508303544321/923445881389338634/965914553479200808
	EMPLOYEERATIOS = {
		"Food": 28,
		"Tobacco": 9,
		"Pharmaceutical": 31,
		"Computer": 37,
		"Robotics": 30,
		"Software": 37,
		"Healthcare": 27,
		"RealEstate": 0
	};

	HQ = ["Sector-12"];

	CITIES = ["Sector-12", "Aevum", "Chongqing", "New Tokyo", "Ishima", "Volhaven"];

	SIMPLEINDUSTRIES = ["Agriculture", "Energy", "Utilities", "Fishing", "Mining", "Chemical", "Pharmaceutical", "Computer", "Robotics", "Software", "RealEstate"];

	PRODUCTINDUSTRIES = ["Food", "Tobacco", "Pharmaceutical", "Computer", "Robotics", "Software", "Healthcare", "RealEstate"];

	OFFERS = [210e9, 5e12, 800e12, 128e15];

	WAREHOUSEMULTS = {
    	"Energy": {
			"Real Estate": .65,
		    "Hardware": 0,
			"Robots": .05,
			"AI Cores": .3
		},
	    "Utilities": {
			"Real Estate": .5,
			"Hardware": 0,
			"Robots": .4,
			"AI Cores": .4
		},
	    "Agriculture": {
            "Real Estate": .72,
			"Hardware": .2,
			"Robots": .3,
			"AI Cores": .3
		},
	    "Fishing": {
			"Real Estate": .15,
			"Hardware": .35,
			"Robots": .5,
			"AI Cores": .2
		},
	    "Mining": {
		    "Real Estate": .3, 
			"Hardware": 0,
			"Robots": .45,
			"AI Cores": .45
		},
	    "Food": {
            "Real Estate": .05,
			"Hardware": .15,
			"Robots": .3,
			"AI Cores": .25
		},
	    "Tobacco": {
		    "Real Estate": .15,
			"Hardware": .15,
			"Robots": .2,
			"AI Cores": .15
		},
	    "Chemical": {
			"Real Estate": .25,
			"Hardware": .2,
			"Robots": .25,
			"AI Cores": .2
		},
	    "Pharmaceutical": {
		    "Real Estate": .05,
			"Hardware": .15,
			"Robots": .25,
			"AI Cores": .2
		},
	    "Computer": {
			"Real Estate": .2,
			"Hardware": 0,
			"Robots": .36,
			"AI Cores": .19
		},
	    "Robotics": {
			"Real Estate": .32,
			"Hardware": .19,
			"Robots": 0,
			"AI Cores": .36
		},
	    "Software": {
		    "Real Estate": .15,
			"Hardware": 0,
			"Robots": .05,
			"AI Cores": 0
		},
	    "Healthcare": {
			"Real Estate": .1,
			"Hardware": .1,
			"Robots": .1,
			"AI Cores": .1
		},
	    "RealEstate": {
			"Real Estate": 0,
			"Hardware": 0,
			"Robots": .6, 
			"AI Cores": .6
		}
    };

	// WAREHOUSEMULTS = {
//	"Energy": [.65, 0, .05, .3],
//	"Utilities": [.5, 0, .4, .4],
//	"Agriculture": [.72, .2, .3, .3],
//	"Fishing": [.15, .35, .5, .2],
//	"Mining": [.3, .4, .45, .45],
//	"Food": [.05, .15, .3, .25],
//	"Tobacco": [.15, .15, .2, .15],
//	"Chemical": [.25, .2, .25, .2],
//	"Pharmaceutical": [.05, .15, .25, .2],
//	"Computer": [.2, 0, .36, .19],
//	"Robotics": [.32, .19, 0, .36],
//	"Software": [.15, .25, .05, .18],
//	"Healthcare": [.1, .1, .1, .1],
//	"RealEstate": [0, .05, .6, .6]
//}

    SELLPRODS = {
	    "Agriculture": ["Food", "Plants"],
	    "Software": ["AICores"],
	    "Energy": ["Energy"],
	    "Utilities": ["Water"],
	    "Fishing": ["Food"],
	    "Mining": ["Metal"],
	    "Chemical": ["Chemicals"],
	    "Pharmaceutical": ["Drugs"],
	    "Computer": ["Hardware"],
	    "Robotics": ["Robots"],
	    "RealEstate": ["RealEstate"]
    }

	MATERIALSIZES = {
		"Real Estate": .005,
		"Hardware": .06, 
		"Robots": .5,
		"AI Cores": .1
	};

	constructor(ns, names = {
		"Corp": "Jeek Heavy Industries",
		"Agriculture": {
			"Name": "Soylent Jeek",
			"Cost": 40e9
		},
		"Chemical": {
			"Name": "Based Acidics",
			"Cost": 70e9
		},
		"Computer": {
			"Name": "2-Bit",
			"Cost": 500e9,
			"Products": ["4-Bit", "8-Bit", "16-Bit", "32-Bit", "64-Bit"]
		},
		"Energy": {
			"Name": "Burrito-Fed Methane",
			"Cost": 225e9
		},
		"Fishing": {
			"Name": "Smells Like Fish",
			"Cost": 80e9
		},
		"Food": {
			"Name": "jeek Heavier Industries",
			"Cost": 10e9,
			"Products": ["Taco Hole", "Burrito Gorge", "Pizza Slut", "Chicken Jeeka Masala", "Gorge Buffet"]
		},
		"Healthcare": {
			"Name": "Assisted Unliving",
			"Cost": 750e9,
			"Products": ["Horribie Hospice", "Grandma Killers", "TurboInheritance", "Elderly Abuse", "SterilizerCo"]
		},
		"Mining": {
			"Name": "Deep Diggers",
			"Cost": 300e9
		},
		"Pharmaceutical": {
			"Name": "The Good Drugs",
			"Cost": 200e9,
			"Products": ["Hydroxychloroquine Sulfate", "Chloroquine Sulfate", "Cannabidiol", "Nasitrol", "Arsenicum"]
		},
		"RealEstate": {
			"Name": "Land Ho",
			"Cost": 600e9,
			"Products": ["Hole in the Wall", "Raising Acres", "Skyview", "Frolicking", "Wonderwall"]
		},
		"Robotics": {
			"Name": "DeathBot",
			"Cost": 1e12,
			"Products": ["DeathBorg", "MurderBot", "KillDozer", "Suicide Booth", "Fisto"]
		},
		"Software": {
			"Name": "MacroHard",
			"Cost": 25e9,
			"Products": ["MacroHard Paint", "MacroHard Calc", "MacroHard Write", "MacroHard Comms", "MacroHard Base-a-Date"]
		},
		"Tobacco": {
			"Name": "Pole Smokers",
			"Cost": 20e9,
            "Products": ["Tobacco Classic", "New Tobacco", "Tobacco Zero", "Diet Tobacco", "Caffeine-Free Tobacco"]
    	},
		"Utilities": {
			"Name": "Also Smells Like Fish",
			"Cost": 150e9
		}
    }, plan = {
		0: {
			"Upgrades": {
				"FocusWires": 2,
				"Neural Accelerators": 2,
				"Speech Processor Implants": 2,
				"Nuoptimal Nootropic Injector Implants": 2,
				"Smart Factories": 2
			},
			"Divisions": {
			    "Agriculture": {
					"Modules": ["Smart Supply"],
					"AdVert.Inc": 1,
					"Storage": 300,
				    "Employees": 3
    			}
	    	}
    	},
		1: {
			"Upgrades": {
				"Smart Factories": 10,
				"Smart Storage": 10
			},
			"Divisions": {
				"Agriculture": {
					"Employees": 9,
					"Storage": 2000
				}
			}
		},
		2: {
			"Upgrades": {
				"Wilson Analytics": 14,
				"FocusWires": 20,
				"Neural Accelerators": 20,
				"Speech Processor Implants": 20,
				"NuOptimal NooTropic Injector Implants": 20
			},
			"Divisions": {
				"Agriculture": {
					"Employees": 9,
					"Storage": 3800
				},
				"Tobacco": {
					"Employees": 30
				}
			}
		},
		3: {
			"Upgrades": {
				"Wilson Analytics": 14,
				"FocusWires": 20,
				"Neural Accelerators": 20,
				"Speech Processor Implants": 20,
				"NuOptimal NooTropic Injector Implants": 20
			},
			"Divisions": {
				"Agriculture": {
					"Employees": 9,
					"Storage": 3800
				},
				"Tobacco": {
					"Employees": 30
				}
			}
		},
		4: {
			"Upgrades": {
				"Wilson Analytics": 14,
				"FocusWires": 20,
				"Neural Accelerators": 20,
				"Speech Processor Implants": 20,
				"NuOptimal NooTropic Injector Implants": 20
			},
			"Divisions": {
				"Agriculture": {
					"Employees": 9,
					"Storage": 3800
				},
				"Tobacco": {
					"Employees": 30
				}
			}
		},
		5: {
			"Upgrades": {
				"Wilson Analytics": 14,
				"FocusWires": 20,
				"Neural Accelerators": 20,
				"Speech Processor Implants": 20,
				"NuOptimal NooTropic Injector Implants": 20
			},
			"Divisions": {
				"Agriculture": {
					"Employees": 9,
					"Storage": 3800
				},
				"Tobacco": {
					"Employees": 30
				}
			}
		}
	}) {
		this.ns = ns;
		this.names = names;
		this.plan = plan;
	}
	async init() {
		
	}
	get round() {
		return (async () => {
			try {
				return await Do(this.ns, "ns.corporation.getInvestmentOffer().round", this.name);
			} catch(e) {
				return -1;
			}
		})();
	}
}

let possibleArguments = [
	['help', false],
	['corp', false]
];

export async function main(ns) {
	// Roulette?
	let corp = new Corp(ns);
	await corp.init();
	const options = ns.flags(possibleArguments);
	if (options.corp) {
		while (true) {
			await corp.loop();
			await ns.sleep(0);
		}
	}
	// Stanek
	// LOOP
	//   Backdoor
	//   Corps
	//   Gang
	//   Hack Something
	//   Stonks
	//   Bladeburner
	//   Hacknet
	//   Set/Review/Implement Augment Goals [Jobs/Grafting]
	//   Move Stanek?
	//   Contracts
}
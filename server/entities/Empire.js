const { v4: uuidv4 } = require('uuid');

class Empire {
    constructor(data = {}) {
        this.id = data.id || uuidv4();
        this.name = data.name || 'New Empire';
        this.playerId = data.player_id || data.playerId || null;
        this.faction = data.faction || 'human';
        this.color = data.color || '#0066CC';
        this.capitalPlanetId = data.capital_planet_id || data.capitalPlanetId || null;
        this.homeSystemId = data.home_system_id || data.homeSystemId || null;
        this.governmentType = data.government_type || data.governmentType || 'democracy';
        this.culture = data.culture || 'human';
        this.createdAt = data.created_at || data.createdAt || Date.now();
        
        // Empire statistics
        this.totalPopulation = data.total_population || data.totalPopulation || 0;
        this.totalSystems = data.total_systems || data.totalSystems || 0;
        this.totalPlanets = data.total_planets || data.totalPlanets || 0;
        this.totalFleets = data.total_fleets || data.totalFleets || 0;
        this.empireLevel = data.empire_level || data.empireLevel || 1;
        this.experiencePoints = data.experience_points || data.experiencePoints || 0;
        this.reputation = data.reputation || 0;
        
        // Resources
        this.resources = this.parseJsonField(data.resources) || {
            credits: 10000,         // Currency
            energy: 1000,           // Power generation
            minerals: 1000,         // Raw materials
            food: 1000,             // Population sustenance
            research: 100,          // Science points
            influence: 50,          // Diplomatic power
            alloys: 100,            // Advanced materials
            exotic_matter: 0,       // Rare resources
            dark_matter: 0,         // Ultra-rare resources
            antimatter: 0,          // End-game resources
            unity: 0,               // Cultural/unity points
            consumer_goods: 500,    // Population happiness
            strategic_resources: {  // Special resources
                zro: 0,
                living_metal: 0,
                dark_matter: 0,
                nanites: 0
            }
        };
        
        // Resource storage and production
        this.resourceProduction = {
            credits: 50,
            energy: 20,
            minerals: 15,
            food: 10,
            research: 5,
            influence: 3,
            alloys: 2,
            exotic_matter: 0,
            consumer_goods: 5
        };
        
        this.resourceStorage = {
            credits: 100000,
            energy: 10000,
            minerals: 10000,
            food: 10000,
            research: 1000,
            influence: 1000,
            alloys: 5000,
            exotic_matter: 1000,
            consumer_goods: 10000
        };
        
        // Technologies
        this.technologies = this.parseJsonField(data.technologies) || {
            researched: ['basic_engineering', 'basic_physics', 'basic_society'],
            available: [],
            current: null,
            researchProgress: 0,
            researchSpeed: 1.0,
            researchQueue: []
        };
        
        // Policies and edicts
        this.policies = this.parseJsonField(data.policies) || {
            economic: 'balanced',     // balanced, expansionist, industrial, commercial
            military: 'defensive',    // defensive, offensive, balanced, pacifist
            diplomatic: 'neutral',    // neutral, isolationist, collaborative, aggressive
            research: 'balanced',     // balanced, physics, engineering, society
            expansion: 'moderate',    // slow, moderate, aggressive
            population: 'balanced',   // growth, equality, productivity
            trade: 'free_market',     // free_market, regulated, planned
            environment: 'balanced'   // exploitation, balanced, conservation
        };
        
        // Active edicts (temporary empire-wide bonuses)
        this.activeEdicts = [];
        
        // Empire traits and characteristics
        this.traits = data.traits || [];
        this.civics = data.civics || [];
        this.ethics = data.ethics || ['materialist', 'egalitarian'];
        
        // Diplomatic relations
        this.diplomaticRelations = new Map();
        this.diplomaticStatus = {
            totalEmbassies: 0,
            activeTreaties: 0,
            activeWars: 0,
            trustLevel: 0,
            warWeariness: 0
        };
        
        // Military
        this.military = {
            totalFleetPower: 0,
            totalArmies: 0,
            navalCapacity: 20,
            navalCapacityUsed: 0,
            admirals: [],
            generals: [],
            doctrines: {
                naval: 'balanced',
                army: 'combined_arms'
            }
        };
        
        // Economy details
        this.economy = {
            grossDomesticProduct: 0,
            tradeValue: 0,
            marketShare: 0,
            unemploymentRate: 0,
            energyBalance: 0,
            mineralBalance: 0,
            foodBalance: 0,
            consumerGoodsBalance: 0,
            tradeRoutes: [],
            commercialPacts: [],
            monthlyIncome: {},
            monthlyExpenses: {}
        };
        
        // Science and research
        this.research = {
            totalResearchOutput: 0,
            physicsResearch: 0,
            engineeringResearch: 0,
            societyResearch: 0,
            researchEfficiency: 1.0,
            activeProjects: [],
            scientists: [],
            researchInstitutes: 0
        };
        
        // Empire modifiers
        this.modifiers = {
            resourceProduction: {},
            researchSpeed: 1.0,
            shipBuildSpeed: 1.0,
            buildingBuildSpeed: 1.0,
            populationGrowth: 1.0,
            happiness: 0,
            stability: 0.5,
            influence: 1.0,
            diplomaticWeight: 1.0,
            navalCapacity: 1.0,
            administrativeCapacity: 20
        };
        
        // Territory and expansion
        this.territory = {
            controlledSystems: [],
            controlledPlanets: [],
            borders: [],
            claims: [],
            exploredSystems: [],
            surveySites: [],
            anomalies: [],
            archaeology_sites: []
        };
        
        // Empire goals and objectives
        this.objectives = {
            short_term: [],
            long_term: [],
            victory_conditions: {
                conquest: { progress: 0, required: 60 },
                science: { progress: 0, required: 100 },
                economic: { progress: 0, required: 50 },
                diplomatic: { progress: 0, required: 70 },
                cultural: { progress: 0, required: 80 }
            }
        };
        
        // Empire events and history
        this.history = {
            foundingDate: this.createdAt,
            majorEvents: [],
            wars: [],
            discoveries: [],
            achievements: [],
            rulers: []
        };
        
        // Population and demographics
        this.population = {
            totalPops: 0,
            happiness: 0.5,
            stability: 0.5,
            growthRate: 0.01,
            species: [],
            jobDistribution: {
                workers: 0,
                specialists: 0,
                rulers: 0
            },
            unemployed: 0
        };
        
        // Empire AI behavior (for AI empires)
        this.aiPersonality = data.aiPersonality || null;
        this.aiGoals = data.aiGoals || [];
        this.aiTendencies = data.aiTendencies || {};
        
        // Performance tracking
        this.performance = {
            lastUpdate: Date.now(),
            updateTime: 0,
            calculationComplexity: 0
        };
    }

    // Utility method to parse JSON fields
    parseJsonField(field) {
        if (typeof field === 'string') {
            try {
                return JSON.parse(field);
            } catch (e) {
                console.warn('Failed to parse JSON field:', field);
                return null;
            }
        }
        return field;
    }

    // Update empire state
    update(gameState) {
        const startTime = Date.now();
        
        // Update resources
        this.updateResources();
        
        // Update research
        this.updateResearch();
        
        // Update population
        this.updatePopulation();
        
        // Update economy
        this.updateEconomy();
        
        // Update territory
        this.updateTerritory(gameState);
        
        // Update military
        this.updateMilitary(gameState);
        
        // Update modifiers
        this.updateModifiers();
        
        // Update objectives
        this.updateObjectives();
        
        // Check for level up
        this.checkLevelUp();
        
        // Performance tracking
        this.performance.lastUpdate = Date.now();
        this.performance.updateTime = Date.now() - startTime;
    }

    // Update resource production and consumption
    updateResources() {
        const production = this.calculateResourceProduction();
        const consumption = this.calculateResourceConsumption();
        
        // Apply resource changes
        Object.keys(this.resources).forEach(resource => {
            if (resource !== 'strategic_resources') {
                const netChange = (production[resource] || 0) - (consumption[resource] || 0);
                this.resources[resource] = Math.max(0, 
                    Math.min(this.resources[resource] + netChange, this.resourceStorage[resource] || Infinity)
                );
            }
        });
        
        // Update resource production for display
        this.resourceProduction = production;
        
        // Update economy balance
        this.economy.energyBalance = production.energy - consumption.energy;
        this.economy.mineralBalance = production.minerals - consumption.minerals;
        this.economy.foodBalance = production.food - consumption.food;
        this.economy.consumerGoodsBalance = production.consumer_goods - consumption.consumer_goods;
    }

    // Calculate total resource production
    calculateResourceProduction() {
        const baseProduction = { ...this.resourceProduction };
        
        // Apply empire modifiers
        Object.keys(baseProduction).forEach(resource => {
            const modifier = this.modifiers.resourceProduction[resource] || 1.0;
            baseProduction[resource] *= modifier;
        });
        
        // Add building and planet bonuses
        // This would be calculated from controlled planets and buildings
        
        return baseProduction;
    }

    // Calculate total resource consumption
    calculateResourceConsumption() {
        const consumption = {
            credits: this.military.navalCapacityUsed * 0.5,
            energy: Math.floor(this.totalPopulation / 100) + this.military.navalCapacityUsed * 0.2,
            minerals: 0,
            food: Math.floor(this.totalPopulation / 10),
            research: 0,
            influence: this.totalSystems * 0.5,
            alloys: 0,
            consumer_goods: Math.floor(this.totalPopulation / 20)
        };
        
        return consumption;
    }

    // Update research progress
    updateResearch() {
        if (this.technologies.current) {
            const researchSpeed = this.research.totalResearchOutput * this.modifiers.researchSpeed;
            this.technologies.researchProgress += researchSpeed;
            
            // Check if research is complete
            const currentTech = this.getCurrentResearchTechnology();
            if (currentTech && this.technologies.researchProgress >= currentTech.cost) {
                this.completeResearch(this.technologies.current);
            }
        }
    }

    // Complete a research project
    completeResearch(technologyId) {
        // Add to researched technologies
        this.technologies.researched.push(technologyId);
        
        // Remove from available
        this.technologies.available = this.technologies.available.filter(id => id !== technologyId);
        
        // Reset current research
        this.technologies.current = null;
        this.technologies.researchProgress = 0;
        
        // Update available technologies based on prerequisites
        this.updateAvailableTechnologies();
        
        // Apply technology effects
        this.applyTechnologyEffects(technologyId);
        
        // Auto-start next research if queue exists
        if (this.technologies.researchQueue.length > 0) {
            this.technologies.current = this.technologies.researchQueue.shift();
        }
        
        // Add to history
        this.history.discoveries.push({
            type: 'technology',
            technologyId: technologyId,
            date: Date.now()
        });
    }

    // Update population
    updatePopulation() {
        const growthRate = this.population.growthRate * this.modifiers.populationGrowth;
        const populationGrowth = Math.floor(this.totalPopulation * growthRate);
        
        this.totalPopulation += populationGrowth;
        this.population.totalPops = this.totalPopulation;
        
        // Update happiness and stability based on various factors
        this.updatePopulationHappiness();
    }

    // Update population happiness
    updatePopulationHappiness() {
        let happiness = 0.5; // Base happiness
        
        // Resource availability affects happiness
        if (this.economy.foodBalance >= 0) happiness += 0.1;
        if (this.economy.consumerGoodsBalance >= 0) happiness += 0.1;
        if (this.resources.consumer_goods > 1000) happiness += 0.1;
        
        // Unemployment reduces happiness
        if (this.population.unemployed > 0) {
            happiness -= (this.population.unemployed / this.totalPopulation) * 0.5;
        }
        
        // War weariness affects happiness
        happiness -= this.diplomaticStatus.warWeariness * 0.3;
        
        // Apply empire modifiers
        happiness += this.modifiers.happiness;
        
        this.population.happiness = Math.max(0, Math.min(1, happiness));
        
        // Stability is affected by happiness
        this.population.stability = Math.max(0.1, Math.min(1, this.population.happiness + this.modifiers.stability));
    }

    // Update economy
    updateEconomy() {
        // Calculate GDP
        this.economy.grossDomesticProduct = 
            this.resourceProduction.credits * 12 + 
            this.resourceProduction.energy * 2 + 
            this.resourceProduction.minerals * 1.5 + 
            this.resourceProduction.alloys * 4;
        
        // Calculate trade value
        this.economy.tradeValue = this.economy.tradeRoutes.reduce((total, route) => {
            return total + route.value;
        }, 0);
        
        // Update unemployment
        const totalJobs = this.population.jobDistribution.workers + 
                         this.population.jobDistribution.specialists + 
                         this.population.jobDistribution.rulers;
        this.economy.unemploymentRate = Math.max(0, (this.totalPopulation - totalJobs) / this.totalPopulation);
        this.population.unemployed = Math.max(0, this.totalPopulation - totalJobs);
    }

    // Update territory information
    updateTerritory(gameState) {
        // Update controlled systems and planets from game state
        this.territory.controlledSystems = [];
        this.territory.controlledPlanets = [];
        
        // Count systems and planets controlled by this empire
        for (const [systemId, system] of gameState.starSystems) {
            if (system.discoveredBy === this.id) {
                this.territory.exploredSystems.push(systemId);
            }
        }
        
        for (const [planetId, planet] of gameState.planets) {
            if (planet.ownerEmpireId === this.id) {
                this.territory.controlledPlanets.push(planetId);
            }
        }
        
        // Update totals
        this.totalSystems = this.territory.controlledSystems.length;
        this.totalPlanets = this.territory.controlledPlanets.length;
    }

    // Update military statistics
    updateMilitary(gameState) {
        let totalFleetPower = 0;
        let navalCapacityUsed = 0;
        let fleetCount = 0;
        
        // Calculate from fleets
        for (const [fleetId, fleet] of gameState.fleets) {
            if (fleet.empireId === this.id) {
                totalFleetPower += fleet.totalFirepower || 0;
                navalCapacityUsed += fleet.fleetSize || 0;
                fleetCount++;
            }
        }
        
        this.military.totalFleetPower = totalFleetPower;
        this.military.navalCapacityUsed = navalCapacityUsed;
        this.totalFleets = fleetCount;
        
        // Update naval capacity based on starbases, technologies, etc.
        this.military.navalCapacity = 20 + (this.totalSystems * 2) + (this.empireLevel * 5);
        this.military.navalCapacity *= this.modifiers.navalCapacity;
    }

    // Update empire modifiers
    updateModifiers() {
        // Reset modifiers to base values
        this.modifiers = {
            resourceProduction: {},
            researchSpeed: 1.0,
            shipBuildSpeed: 1.0,
            buildingBuildSpeed: 1.0,
            populationGrowth: 1.0,
            happiness: 0,
            stability: 0,
            influence: 1.0,
            diplomaticWeight: 1.0,
            navalCapacity: 1.0,
            administrativeCapacity: 20 + (this.empireLevel * 5)
        };
        
        // Apply technology modifiers
        this.applyTechnologyModifiers();
        
        // Apply building modifiers
        this.applyBuildingModifiers();
        
        // Apply policy modifiers
        this.applyPolicyModifiers();
        
        // Apply trait modifiers
        this.applyTraitModifiers();
    }

    // Apply technology modifiers
    applyTechnologyModifiers() {
        for (const techId of this.technologies.researched) {
            // Apply specific technology effects
            switch (techId) {
                case 'improved_engineering':
                    this.modifiers.buildingBuildSpeed *= 1.25;
                    break;
                case 'advanced_physics':
                    this.modifiers.researchSpeed *= 1.15;
                    break;
                case 'colonial_administration':
                    this.modifiers.administrativeCapacity += 10;
                    break;
                // Add more technology effects
            }
        }
    }

    // Apply building modifiers (would be calculated from planet buildings)
    applyBuildingModifiers() {
        // This would iterate through all controlled planets and their buildings
        // For now, basic implementation
    }

    // Apply policy modifiers
    applyPolicyModifiers() {
        // Economic policies
        switch (this.policies.economic) {
            case 'expansionist':
                this.modifiers.influence *= 1.2;
                this.modifiers.administrativeCapacity *= 0.9;
                break;
            case 'industrial':
                this.modifiers.resourceProduction.minerals = 1.15;
                this.modifiers.resourceProduction.alloys = 1.15;
                break;
            case 'commercial':
                this.modifiers.resourceProduction.credits = 1.2;
                this.modifiers.resourceProduction.consumer_goods = 1.1;
                break;
        }
        
        // Military policies
        switch (this.policies.military) {
            case 'offensive':
                this.modifiers.navalCapacity *= 1.2;
                this.modifiers.resourceProduction.influence = 0.9;
                break;
            case 'defensive':
                this.modifiers.stability += 0.1;
                this.modifiers.happiness += 0.05;
                break;
            case 'pacifist':
                this.modifiers.resourceProduction.research = 1.15;
                this.modifiers.populationGrowth *= 1.1;
                break;
        }
        
        // Research policies
        switch (this.policies.research) {
            case 'physics':
                this.research.physicsResearch *= 1.3;
                break;
            case 'engineering':
                this.research.engineeringResearch *= 1.3;
                break;
            case 'society':
                this.research.societyResearch *= 1.3;
                break;
        }
    }

    // Apply trait modifiers
    applyTraitModifiers() {
        for (const trait of this.traits) {
            switch (trait) {
                case 'industrious':
                    this.modifiers.resourceProduction.minerals = 1.15;
                    break;
                case 'intelligent':
                    this.modifiers.researchSpeed *= 1.2;
                    break;
                case 'charismatic':
                    this.modifiers.happiness += 0.1;
                    break;
                case 'rapid_breeders':
                    this.modifiers.populationGrowth *= 1.25;
                    break;
                // Add more traits
            }
        }
    }

    // Update empire objectives and victory conditions
    updateObjectives() {
        // Update victory condition progress
        this.objectives.victory_conditions.conquest.progress = 
            (this.totalSystems / 100) * 100; // Assuming 100 systems for conquest victory
        
        this.objectives.victory_conditions.science.progress = 
            (this.technologies.researched.length / 150) * 100; // Assuming 150 techs for science victory
        
        this.objectives.victory_conditions.economic.progress = 
            (this.economy.grossDomesticProduct / 100000) * 100; // Economic threshold
        
        this.objectives.victory_conditions.diplomatic.progress = 
            (this.diplomaticStatus.activeTreaties / 10) * 100; // Diplomatic threshold
    }

    // Check for empire level up
    checkLevelUp() {
        const requiredExp = this.getRequiredExperienceForLevel(this.empireLevel + 1);
        
        if (this.experiencePoints >= requiredExp) {
            this.levelUp();
        }
    }

    // Level up the empire
    levelUp() {
        this.empireLevel++;
        
        // Grant level up bonuses
        this.modifiers.administrativeCapacity += 5;
        this.military.navalCapacity += 5;
        
        // Add to history
        this.history.majorEvents.push({
            type: 'level_up',
            level: this.empireLevel,
            date: Date.now()
        });
    }

    // Get required experience for a specific level
    getRequiredExperienceForLevel(level) {
        return Math.floor(100 * Math.pow(level, 1.5));
    }

    // Add experience points
    addExperience(amount, source = 'unknown') {
        this.experiencePoints += amount;
        
        // Log experience gain
        this.history.majorEvents.push({
            type: 'experience_gain',
            amount: amount,
            source: source,
            date: Date.now()
        });
    }

    // Get current research technology
    getCurrentResearchTechnology() {
        // This would look up the technology from a technology database
        // For now, return basic info
        return {
            id: this.technologies.current,
            cost: 1000,
            field: 'physics'
        };
    }

    // Update available technologies
    updateAvailableTechnologies() {
        // This would calculate which technologies are now available
        // based on prerequisites and already researched technologies
    }

    // Apply technology effects
    applyTechnologyEffects(technologyId) {
        // Apply the effects of a newly researched technology
        switch (technologyId) {
            case 'improved_engineering':
                this.addExperience(50, 'technology');
                break;
            case 'basic_weapons':
                this.addExperience(30, 'technology');
                break;
            // Add more technology effects
        }
    }

    // Get empire power rating
    getPowerRating() {
        let power = 0;
        
        power += this.military.totalFleetPower * 2;
        power += this.totalPlanets * 100;
        power += this.totalSystems * 50;
        power += this.economy.grossDomesticProduct * 0.01;
        power += this.technologies.researched.length * 20;
        power += this.totalPopulation * 0.1;
        
        return Math.floor(power);
    }

    // Get empire efficiency rating
    getEfficiencyRating() {
        const factors = [
            this.population.happiness,
            this.population.stability,
            1 - this.economy.unemploymentRate,
            Math.min(1, this.economy.energyBalance / 100),
            Math.min(1, this.economy.mineralBalance / 100),
            Math.min(1, this.research.totalResearchOutput / 100)
        ];
        
        const average = factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
        return Math.round(average * 100);
    }

    // Get detailed empire data
    getDetailedData() {
        return {
            id: this.id,
            name: this.name,
            playerId: this.playerId,
            faction: this.faction,
            color: this.color,
            level: this.empireLevel,
            experiencePoints: this.experiencePoints,
            powerRating: this.getPowerRating(),
            efficiencyRating: this.getEfficiencyRating(),
            
            // Territory
            totalSystems: this.totalSystems,
            totalPlanets: this.totalPlanets,
            totalPopulation: this.totalPopulation,
            
            // Resources
            resources: this.resources,
            resourceProduction: this.resourceProduction,
            resourceStorage: this.resourceStorage,
            
            // Military
            military: this.military,
            totalFleets: this.totalFleets,
            
            // Economy
            economy: this.economy,
            
            // Research
            research: this.research,
            technologies: this.technologies,
            
            // Population
            population: this.population,
            
            // Diplomacy
            diplomaticStatus: this.diplomaticStatus,
            
            // Policies
            policies: this.policies,
            activeEdicts: this.activeEdicts,
            
            // Characteristics
            governmentType: this.governmentType,
            culture: this.culture,
            traits: this.traits,
            civics: this.civics,
            ethics: this.ethics,
            
            // Objectives
            objectives: this.objectives,
            
            // Timestamps
            createdAt: this.createdAt,
            lastUpdate: this.performance.lastUpdate
        };
    }

    // Get public data (for other players)
    getPublicData() {
        return {
            id: this.id,
            name: this.name,
            faction: this.faction,
            color: this.color,
            level: this.empireLevel,
            powerRating: this.getPowerRating(),
            totalSystems: this.totalSystems,
            totalPlanets: this.totalPlanets,
            governmentType: this.governmentType,
            culture: this.culture,
            ethics: this.ethics,
            createdAt: this.createdAt
        };
    }

    // Get database save data
    getDatabaseData() {
        return {
            id: this.id,
            name: this.name,
            playerId: this.playerId,
            faction: this.faction,
            color: this.color,
            capitalPlanetId: this.capitalPlanetId,
            homeSystemId: this.homeSystemId,
            governmentType: this.governmentType,
            culture: this.culture,
            createdAt: this.createdAt,
            totalPopulation: this.totalPopulation,
            totalSystems: this.totalSystems,
            totalPlanets: this.totalPlanets,
            totalFleets: this.totalFleets,
            empireLevel: this.empireLevel,
            experiencePoints: this.experiencePoints,
            reputation: this.reputation,
            resources: JSON.stringify(this.resources),
            technologies: JSON.stringify(this.technologies),
            policies: JSON.stringify(this.policies)
        };
    }

    // Validate empire data
    validate() {
        const errors = [];
        
        if (!this.name || this.name.length < 3) {
            errors.push('Empire name must be at least 3 characters long');
        }
        
        if (!this.playerId) {
            errors.push('Empire must be associated with a player');
        }
        
        if (!this.faction) {
            errors.push('Empire must have a faction');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Clone empire
    clone() {
        return new Empire(this.getDatabaseData());
    }

    // String representation
    toString() {
        return `Empire(${this.name}, Level ${this.empireLevel}, ${this.totalSystems} systems)`;
    }
}

module.exports = Empire;
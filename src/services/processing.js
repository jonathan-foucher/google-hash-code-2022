const Person = require('../models/Person')
const Project = require('../models/Project')
const Skill = require('../models/Skill');

class ProcessingService {
  process(data) {
    this.reset();
    this.dataToObjects(data);
    this.simulate();
    console.info(this.score);
    return this.formatResults();
  }

  dataToObjects(data) {
    const firstLine = data[0].split(' ');
    this.numberOfContributors = parseInt(firstLine[0], 10);
    this.numberOfProjects = parseInt(firstLine[1], 10);

    let actualRow = 0;
    for (let contributor = 0; contributor < this.numberOfContributors; contributor++) {
      actualRow++;
      const personLine = data[actualRow].split(' ');
      const personNbOfSkills =  parseInt(personLine[1], 10);
      const personSkills = [];
      for (let skill = 0; skill < personNbOfSkills; skill++) {
        actualRow++;
        const skillLine = data[actualRow].split(' ');
        personSkills.push(new Skill(skillLine[0], parseInt(skillLine[1], 10)));
      }
      this.persons.push(new Person(personLine[0], personSkills));
    }

    for (let project = 0; project < this.numberOfProjects; project++) {
      actualRow++;
      const projectLine = data[actualRow].split(' ');
      const roles = [];
      const projectNbOfRole = parseInt(projectLine[4], 10);
      for(let role = 0; role < projectNbOfRole; role++) {
        actualRow++;
        const roleLine = data[actualRow].split(' ');
        roles.push(new Skill(roleLine[0], parseInt(roleLine[1], 10)));
      }
      this.projects.push(new Project(projectLine[0], parseInt(projectLine[1], 10), parseInt(projectLine[2], 10), parseInt(projectLine[3], 10), roles));
    }
  }

  simulate() {
    let availableProjects = [];
    do {
      this.projects.filter(project => project.isInProgress).forEach(project => project.progression++);

      this.projects.filter(project => project.isInProgress && project.isFinished()).forEach(project => {
        project.isInProgress = false;
        let contributorIndex = 0; 
        project.contributors.forEach(contributor => {
          contributor.isAvailable = true;
          const role = project.roles[contributorIndex];
          const skill = contributor.skills.find(skill => skill.name === role.name);
          if (role.level >= skill.level) {
            skill.level++;
          }
          contributorIndex++;
        });
        this.score += project.getCompletedScore();
      });
 
      const projectsToBeStarted = this.projects.filter(project => !project.contributors.length && project.calculateActualScore(this.actualDay) > 0);
      // .sort((a, b) => b.calculateActualScore(this.actualDay) - a.calculateActualScore(this.actualDay));
      let availablePersons = this.persons.filter(person => person.isAvailable)

      projectsToBeStarted.forEach(project => {
        let availablePersonsCopy = [...availablePersons];
        const isDoable = project.roles.every(role => {
          const contributorIndex = availablePersonsCopy.findIndex(person => person.hasSkill(role.name, role.level));
          if(contributorIndex >= 0) {
            availablePersonsCopy.splice(contributorIndex, 1);
            return true;
          }
          return false;
        });

        if (isDoable) {
          project.roles.forEach(role => {
            const contributorIndex = availablePersons.findIndex(person => person.hasSkill(role.name, role.level));
            const contributor = (availablePersons.splice(contributorIndex, 1))[0];
            contributor.isAvailable = false;
            project.contributors.push(contributor);
          });
          project.isInProgress = true;
          project.orderId = this.projectOrderId++;
        }
      });

      this.actualDay++;
      availableProjects = this.projects.filter(project => (!project.contributors.length && project.calculateActualScore(this.actualDay) > 0) || project.isInProgress);
    } while (availableProjects.length > 0);
  }

  formatResults() {
    const plannedProjects = this.projects.filter(project => project.contributors.length > 0)
      .sort((a, b) => a.orderId - b.orderId);

    const results = [];
    results.push(plannedProjects.length);
    plannedProjects.forEach(project => {
      results.push(project.name);
      results.push(project.contributors.map(contributor => contributor.name).join(' '));
    });
    return results;
  }

  reset() {
    this.score = 0;
    this.persons = [];
    this.projects = [];
    this.actualDay = 0;
    this.projectOrderId = 1;
  }
};

module.exports = new ProcessingService()

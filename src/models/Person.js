module.exports = class Person {
  constructor(name, skills) {
    this.name = name;
    this.skills = skills;
    this.isAvailable = true;
  }

  hasSkill(requiredSkill, requiredLevel) {
    return this.skills.some(skill => skill.name === requiredSkill && skill.level >= requiredLevel);
  }
};

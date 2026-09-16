function createProject_(p,user){if(!p.projectName)throw new Error('Project name wajib');var o=createEntity_('PROJECTS','projectId','P',p,user);return o}

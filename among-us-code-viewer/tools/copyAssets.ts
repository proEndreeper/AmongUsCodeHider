import * as shell from "shelljs";

// Copy all the view templates
shell.cp( "-R", "src/views", "dist/" );
shell.cp( "-R", "src/CrewLink-server/offsets", "dist/" );
shell.cp( "-R", "assets/banner.png", "dist/" );
shell.cp( "-R", "assets/banner.png", "build/" );
shell.cp( "-R", "node_modules/memoryjs/build/Release/memoryjs.node", "build/" );
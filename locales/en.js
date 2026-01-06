const en = {
  title: "LuaPlayerYT",
  nav: {
    intro: "General Information",
    build: "Build",
    docs: "Engine Documentation",
    additional: "Additional Information",
    buttons: "buttons",
    color: "Color",
    image: "Image",
    intrafont: "intraFont",
    system: "System",
    screen: "screen",
    sound: "sound",
    pmp: "PMP",
    lua: "LUA",
    timer: "timer"
  },
  intro: {
    title: "General Information",
    text: "LuaPlayerYT is a modern open-source LuaPlayer for PSP focused on extensibility and rich functionality.",
    repos: "Repositories",
    mainRepo: "Main repository → ",
    forks: "Forks",
    fork1: "1. entitybtw's fork focused on customization. Created for Minecraft: Story Mode PSP port [mcsm_portable]. Keeps all original assets and adds flexible error screen customization (sound, font, image), uses build.sh script.",
    forkRepo: "Repository → "
  },
  build: {
    title: "Build",
    mainRepo: "Main Repository",
    step1: "1. Install PSPSDK according to ",
    step2: "2. Clone repository:",
    step3: "3. Build:",
    autoBuild: "Repository has auto-build EBOOT.PBP on every change. Latest builds available at ",
    forkRepo: "entitybtw Fork",
    fork1: "1. Install PSPSDK.",
    fork2: "2. Clone repository:",
    fork3: "3. Run build:",
    forkAutoBuild: "Fork also uses auto-build EBOOT.PBP. Latest builds available at "
  },
  docs: {
    title: "Engine Documentation",
    updated: {
      main: "LuaPlayerYT 0.5 beta 3 — documentation based on LuaPlayerYT LLS by илья' antim0118",
      date: "Updated: January 5, 2026"
    },
    buttons: "buttons",
    color: "Color",
    image: "Image",
    align: "Alignment",
    constant: "Constant",
    value: "Value",
    functions: "Functions",
    intrafont: "intraFont",
    scroll: "Scrolling",
    system: "System",
    screen: "screen",
    sound: "sound",
    pmp: "PMP video",
    lua: "LUA - Basic functions",
    timer: "timer",
    name: "Name"
  },
  additional: {
    title: "Additional Information",
    projects: "Projects using LuaPlayerYT:",
    lls: "LuaPlayerYT LLS for VSCode by antim0118",
    install: "Installation",
    step1: "1. Install Lua extension (or sumneko Lua Language Server)",
    step2: "2. Extract LLS folder archive to convenient location (DOWNLOAD LINK BELOW)",
    step3: "3. Set path to extracted LLS folder in settings: File → Preferences → Settings → User tab. Search Lua.workspace.library and enter the path.",
    link: "Link to current LuaPlayerYT LLS archive:",
    credits: "Credits",
    credit1: "> Engine made by Ivan Kodilo",
    credit2: "> This website made by entitybtw / ",
    credit3: "> LuaPlayerYT LLS made by илья' antim0118",
    credit4: "> Main LuaPlayerYT repository owned by илья' antim0118",
    credit5: "> Thanks to cxplay_1465 for helping with comments for the engine documentation."
  },
  themeToggle: "🌙 / ☀️",
  langToggle: "en / ru",
  comments: {
    buttons: {
      read: "reads button states. (preferably call before other reading functions)",
      Lx: "reads stick X position, returns integer value from -128 to 127",
      Ly: "reads stick Y position, returns integer value from -128 to 127",
      pressed: "checks if button was just pressed (not held!)",
      held: "checks if button is currently held",
      released: "checks if button was just released"
    },
    color: {
      new: "create a new color. (r - red component (0-255), g - green component (0-255), b - blue component (0-255), a - alpha/transparency (0-255) [default: 255])",
      get: "get all color components or a specific one from the specified color. (color - pre-created color, RGBA? 'r'|'g'|'b'|'a' specific component [default: returns a table with all values (r/g/b/a)])"
    },
    image: {
      load: "load image into memory (path - path to image)",
      unload: "unload image from memory (texture - previously loaded image)",
      W: "get image height (texture - previously loaded image)",
      H: "get image width (texture - previously loaded image)",
      draw: "full image rendering (texture - previously loaded image, x - X position, y - Y position, w - width (default loaded image size), h - height (default loaded image size), color - image color, srcx and srcy - start coordinates of capture area (default: 0), srcw and srch - end coordinates of capture area (default: srcw = image width, srch = image height)",
      draweasy: "",
      drawCircleOnTex: "draw circle on image",
      createPlaceholder: "creates 'checkered' texture as placeholder"
    },
    intrafont: {
      load: "load font into RAM in TTF and PGF formats (path - path to font, size - font size)",
      setStyle: "sets font style (font - font, size - size, color - color, rotation - rotation, align - alignment)",
      print: "render text (x and y - font position coordinates, text - text to display, textColor - color, font - font, size - size, GU_LINEAR - filtering mode (linear or disabled), align - alignment)",
      printBackground: "render text with background fill (x and y - font position coordinates, text - text to display, textColor - text color, bgColor - background color, font - font, size - size)",
      printColumn: "render text in column (x and y - font position coordinates, text - text to display, width - text width in pixels, textColor - color, font - font, size - size, align - alignment, scroll - scrolling)",
      printContoured: "render text with outline (x and y - position, text - text to display, textColor - text color, contourColor - outline color, font - font, size - size, rotation - rotation)",
      printGradient: "render text with gradient (x and y - position, text - text to display, textColorStart - start color, textColorEnd - end color, font - font, size - size)",
      printStriked: "render strikethrough text (x and y - position, text - text to display, textColor - text color, lineColor - strikethrough line color, font - font, size - size)",
      printShadowed: "render text with shadow (x and y - position, text - text to display, textColor - text color, shadowColor - shadow color, font - font, shadowRotation - light angle, lightDistance - shadow distance, size - size, rotation - rotation)",
      printUnderlined: "render underlined text (x and y - position, text - text to display, textColor - text color, lineColor - line color, font - font, size - size)",
      reverseText: "reverses string backwards (text - source text)",
      size: "change font size (font - font, size - new size)",
      textW: "calculate text width in pixels (font - font, text - text, size - size)",
      textH: "calculate font height in pixels considering current size (font - font)",
      unload: "unload font from memory (font - font)"
    },
    system: {
      rename: "rename file or folder (path - path to file/folder, newName - new name)",
      removeFile: "delete file (path - path to file)",
      removeDir: "delete folder (path - path to folder)",
      createDir: "create new folder (path - path to new folder)",
      isFile: "check if file exists (path - path to file)",
      isDir: "check if path is a folder (path - path to folder)",
      currentDir: "change current working directory (path - path to new directory)",
      listDir: "get list of files and folders in directory (path - path to directory)",
      OSK: "call PSP system keyboard (text - initial text, desc - input field description, cleanBG - clear background, bgpath - path to background)",
      message: "display system message (message - message text, mode - window mode, cleanBG - clear background, bgpath - path to background)",
      getBatteryPercent: "get current battery charge percentage",
      getBatteryLifeTime: "get remaining battery life time in minutes",
      getCPU: "get current processor frequency",
      getModel: "get PSP console model",
      getTime: "get current time and date set on console",
      getOSV: "get installed official firmware version",
      GC: "clear RAM from LUA garbage",
      buttonPressed: "get button pressed in System.message() window",
      getNickname: "get console nickname",
      getLang: "get system language",
      PowerTick: "prevent console from going to sleep mode and screen turning off",
      getGameID: "get game ID (e.g., UCJS10041)",
      getGameTitle: "get current game title",
      SaveData: "save data with slot selection (saveData - data, subTitle - subtitle, description - description, ebootpath - path to EBOOT.PBP, icon0path - path to icon, cleanBG - clear background, bgpath - path to background)",
      LoadData: "load saved data with slot selection (cleanBG - clear background, bgpath - path to background)",
      DeleteData: "delete save via system window (cleanBG - clear background, bgpath - path to background)",
      AutoSave: "automatic data save without interface (saveData - data, subTitle - subtitle, description - description, ebootpath - path to EBOOT.PBP, AutoSaveFolder - autosave folder, icon0path - path to icon)",
      AutoLoad: "automatic load of saved data (AutoSaveFolder - autosave folder)",
      fileDumpCreate: "load file into memory and get pointer (file - path to file)",
      fileDumpGetLine: "get line from loaded file (filePointer - file pointer, pos - line number)",
      fileDumpRemove: "unload file from memory (filePointer - file pointer, linesCount - line count)",
      Net: "connect console to network",
      USB_activate: "activate USB mode",
      USB_deactivate: "deactivate USB mode",
      USB_getState: "get current USB mode state"
    },
    screen: {
      clear: "clear screen before frame rendering (color - screen clear color)",
      flip: "output image from virtual screen to real screen (frame update)",
      filledRect: "draw filled rectangle (x and y - position, width and height - dimensions, color - color, rotation - rotation, alpha - transparency, alignMode - alignment mode)",
      drawLine: "draw line (x1 and y1 - line start, x2 and y2 - line end, color - color)",
      drawCircle: "draw circle (x and y - circle center, radius - radius, color - color)",
      drawTriangle: "draw triangle (x1,y1 / x2,y2 / x3,y3 - vertex coordinates, color - color)"
    },
    sound: {
      cloud: "preload audio file to channel (path - path to .mp3/.wav/.ogg/.at3, channel - sound channel, loadToRam - load to RAM)",
      play: "play loaded audio file (channel - sound channel, loop - loop playback)",
      info: "get ID3 information from mp3 file loaded in channel",
      pause: "pause sound playback (channel - channel)",
      volume: "change playback volume (channel - channel, volumeL - left channel volume, volumeR - right channel volume)",
      stop: "stop sound playback (channel - channel)",
      state: "get sound channel state (channel - channel)",
      unload: "unload audio file from channel (channel - channel)"
    },
    pmp: {
      getFrame: "check video playback and update pointer (pointer - pointer to running PMP, returns true if video is playing)",
      getTimeCode: "get current video playback time in seconds",
      getSubs: "get current video subtitle text",
      pause: "pause video playback",
      play: "play .pmp file (path - path to video, getPointer - return pointer, loop - loop, subtitlePath - path to .srt subtitles, interruptButton - stop button, FPS - frames per second, returns pointer if getPointer = true)",
      setVolume: "set video playback volume (volume - volume from 0 to 100)",
      stop: "stop video playback (pointer - pointer to running PMP)",
      Mp4_Info: "output MP4 file information to console (path - path to file, function likely outdated)"
    },
    lua: {
      print: "output text with system font to screen (x and y - coordinates, text - text to output)",
      getRandom: "generate random number in range from min to max (inclusive)",
      getRAM: "get available RAM in bytes (error ~512 KB)",
      screenshot: "create screen screenshot (path - save path, width and height - image dimensions)",
      exit: "exit to XMB",
      quit: "exit to XMB",
      sleep: "pause script execution for specified milliseconds (ms)"
    },
    timer: {
      create: "create new timer (returns timer object)",
      start: "start previously created timer (timerInstance - timer object)",
      time: "get time counted by timer in milliseconds (timerInstance - timer object)",
      stop: "stop timer (timerInstance - timer object)",
      reset: "stop and reset timer (timerInstance - timer object)",
      remove: "remove timer (timerInstance - timer object)"
    },
download: {
  title: "Download",
  selectDate: "Select date",
  lang: {
    ru: "Russian",
    en: "English"
  },
  offline: {
    title: "Offline version",
    desc: "Select date and language for download:",
    error: "Offline versions not found",
    noFiles: "Files not found",
    loadError: "Error loading files"
  },
  online: {
    title: "GitHub repository",
    desc: "Latest version of documentation:",
    link: "github.com/entitybtw/lpyt-docs"
  },
  selectDatePrompt: "Select date to display files"
}
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = en;
} else {
  window.i18n = window.i18n || {};
  window.i18n.en = en;
}
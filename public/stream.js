Janus.init({
	debug: true,
	dependencies: Janus.useDefaultDependencies(), 
	callback: function() {
	  let janus = new Janus({
      server: "http://" + window.location.hostname + ":8088/janus",
      success: () => {
        janus.attach({
          plugin: "janus.plugin.streaming",
          opaqueId: "streamingtest-"+Janus.randomString(12),
          success: (pluginHandle) => {
            Janus.log(
              "Plugin attached! (" 
              + pluginHandle.getPlugin() 
              + ", id=" + pluginHandle.getId() + ")"
            );
          },
          error: (error) => {
            Janus.error('Error attaching plugin');
          },
        })
      },

    });
	}
});

var mods = [];
var modsBtn = null;
var MODS_DIR = "/sdcard/games/com.mojang/minecraftpe/mods/";
var MOD_VERSION = "0.3.1 Alpha (Deobfuscated)";
var NAPI = {
    dip2px: function (ctx, dips) {
        return Math.ceil(dips * ctx.getResources().getDisplayMetrics().density);
    }
};
var NML = {
    Block: function () {
        material = 1;
        opaque = true;
        render = 0;
        setId = function (nid) {
            id = nid;
            return this;
        };
        setName = function (nname) {
            name = nname;
            return this;
        };
        setTextures = function (ntextures) {
            textures = ntextures;
            return this;
        };
        setMaterial = function (nmaterial) {
            material = nmaterial;
            return this;
        };
        setOpaque = function (nopaque) {
            opaque = nopaque;
            return this;
        };
        setRender = function (nrender) {
            render = nrender;
            return this;
        };
        define = function () {
            Block.defineBlock(id, name, textures, material, opaque,render);
            return this;
        };
    },
    modsBtnF: {
        hide: function () {
            com.mojang.minecraftpe.MainActivity.currentMainActivity.get().runOnUiThread(new java.lang.Runnable({
                run: function () {
                    if (modsBtn != null) {
                        modsBtn.dismiss();
                        modsBtn = null;
                    };
                }
            }));
        },
        show: function () {
            var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
            var btnicon = "!!!REMOVED_BASE64!!!";
            ctx.runOnUiThread(new java.lang.Runnable({
                run: function () {
                    try {
                        var relatlayout = new android.widget.RelativeLayout(ctx);
                        var decodedicon = android.util.Base64.decode(btnicon, 0);
                        var imageview = new android.widget.ImageView(ctx);
                        imageview.setImageBitmap(android.graphics.BitmapFactory.decodeByteArray(decodedicon, 0, decodedicon.length));
                        imageview.setOnClickListener.(new android.view.View.OnClickListener({
                            onClick: function (viewarg) {
                                NML.showModList();
                            }
                        }));
                        relatlayout.addView(imageview);
                        modsBtn = new android.widget.PopupWindow(relatlayout, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT);
                        modsBtn.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
                        modsBtn.showAtLocation(ctx.getWindow()getDecorView(), android.view.Gravity.CENTER | android.view.Gravity.CENTER, 0, NAPI.dip2px(ctx, 80));
                    } catch (err) {
                        print(err);
                    };
                }
            }));
        }
    },
    showModList: function () {
        var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
        var mods = [];
        mods.push("NeoModLoader v" + MOD_VERSION + " by NeoKat");
        mods.push("###########################################");
        mods.push("#    Deobfuscated version by Creeplays    #");
        mods.push("###########################################");
        for (i = 0; i < mods.length; i++) {
            mods.push(mods[i].full);
        };
        var modslist = new android.app.AlertDialog.Builder(ctx);
        modslist.setTitle("Mod List");
        modslist.setItems(mods, null);
        modslist.create().show();
    },
    findModById: function (mod_id) {
        for (i = 0; i < mods.length; i++) {
            if (mods[i].modid != undefined && mods[i].modid == mod_id) {
                return mods[i].file;
            };
        };
        return undefined;
    },
    callMods: function (script_method) {
        var wtf = Array.prototype.slice.call(arguments);
        wtf.shift();
        net.zhuoweizhang.mcpelauncher.ScriptManager.callScriptMethod(script_method, wtf);
    },
    callMod: function (mod, script_method) {
        var sscripts = net.zhuoweizhang.mcpelauncher.ScriptManager.scripts;
        var ctx = org.mozilla.javascript.Context.enter();
        var modscope;
        ctx.setOptimizationLevel(-1);
        modscope = NML.getModScope(mod);
        var modvar = NML.getModVar(mod, script_method);
        if (modvar != null && typeof modvar == "function") {
            try {
                var wtf = Array.prototype.slice.call(arguments);
                wtf.shift();
                wtf.shift();
                return (modvar).call(ctx, wtf);
            } catch (e) {
                print(e);
            };
        };
    },
    loadMod: function (modfile) {
        try {
            net.zhuoweizhang.mcpelauncher.ScriptManager.loadScript(new java.io.File(MODS_DIR + modfile));
        } catch (e) {
            print(e);
        };
    },
    getModScope: function (mod) {
        var sscripts = net.zhuoweizhang.mcpelauncher.ScriptManager.scripts;
        var ctx = org.mozilla.javascript.Context.enter();
        var modscope;
        ctx.setOptimizationLevel(-1);
        for (j = 0; j < sscripts.size(); j++) {
            if (mod == sscripts.get(j).name) {
                return sscripts.get(j).scope;
            };
        };
    },
    getModVar: function (mod, modvarn) {
        var modfile = NML.findModById(mod);
        if (filenl = undefined) {
            return undefined;
        };
        var modscope = NML.getModScope(modfile);
        if (modscope == undefined) {
            return undefined;
        };
        return modscope[modvarn];
    },
    getModVarN: function (mod, modvarn) {
        var modscope = NML.getModScope(mod);
        if (modscope == undefined) {
            return undefined;
        };
        return modscope[modvarn];
    },
    scan2loadMods: function () {
        java.io.File(MODS_DIR).mkdirs();
        var filelist = java.io.File(MODS_DIR).list();
        var modfilelist = [];
        for (i = 0; i < filelist.length; i++) {
            if (/.neomod$/.test(filelist[i])) {
                modfilelist.push(filelist[i]);
            };
        };
        var modfile, modname, modver, modauthor, fullname;
        mods = [];
        for (i = 0; i < modfilelist.length; i++) {
            NML.loadMod(modfilelist[i]);
            modfile = modfilelist[i];
            modid = NML.getModVarN(modfile, "MOD_ID");
            modname = NML.getModVarN(modfile, "MOD_NAME");
            modver = NML.getModVarN(modfile, "MOD_VERSION");
            modauthor = NML.getModVarN(modfile, "MOD_AUTHOR");
            fullname = "";
            if (modname != undefined) {
                fullname = modname;
                if (modid != undefined) {
                    fullname += " (" + modid + ")";
                };
                if (modver != undefined) {
                    fullname += " v" + modver;
                };
                if (modauthor != undefined) {
                    fullname += " by " + modauthor;
                };
            } else {
                fullname = modfile;
            };
            mods[mods.length] = {
                modid: modid,
                file: modfile,
                name: modname,
                ver: modver,
                author: modauthor,
                full: fullname
            };
        };
    }
};
NML.scan2loadMods();
NML.modsBtnF.show();
NML.callMods("init", NML);

function newLevel() {
    NML.modsBtnF.hide();
};

function leaveGame() {
    NML.modsBtnF.show();
};

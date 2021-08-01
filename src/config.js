/*
    Fails Components (Fancy Automated Internet Lecture System - Components)
    Copyright (C)  2015-2017 (original FAILS), 
                   2021- (FAILS Components)  Marten Richter <marten.richter@freenet.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/


export class FailsConfig{
    constructor(args) {
        if (args && args.react) this.react=true;

        if (process.env.NODE_ENV === "development") {
            this.development=true;
        }
        if (process.env.FAILS_LOCAL) { // string with all modules in debug mode
            this.devmode=process.env.FAILS_LOCAL.split(" ");
        }
        if (process.env.REACT_APP_FAILS_LOCAL) { // string with all modules in debug mode
            this.devmode=process.env.REACT_APP_FAILS_LOCAL.split(" ");
        }
        console.log("dev mode", this.devmode);
        console.log("process env",process.env);
        if (process.env.FAILS_DEV_IPHOST) 
        {
            this.host=process.env.FAILS_DEV_IPHOST;
        } else {
            this.host="localhost";
        }

        if (process.env.FAILS_EXTERNAL_HOST)
        {
            this.exthost=process.env.FAILS_EXTERNAL_HOST;
        } else {
            this.exthost=this.host;
        }

        if (process.env.FAILS_STATIC_WEBSERV_TYPE)
        {
            this.statwebservertype=process.env.FAILS_STATIC_WEBSERV_TYPE;
        } else {
            this.statwebservertype='local';
        }

        if (process.env.FAILS_STATIC_SAVE_TYPE)
        {
            this.statsavetype=process.env.FAILS_STATIC_SAVE_TYPE;
        } else {
            this.statsavetype='fs';
        }

        if (process.env.FAILS_MONGO_URL) this.mongourl=process.env.FAILS_MONGO_URL;
        else this.mongourl='mongodb://localhost:27017';

        if (process.env.FAILS_MONGO_DBNAME) this.mongoname=process.env.FAILS_MONGO_DGNAME;
        else this.mongoname='fails';
        

        if (process.env.FAILS_STATIC_SECRET) this.staticsecret=process.env.FAILS_STATIC_SECRET;
        else if (!this.react) throw new Error("Please specifiy FAILS_STATIC_SECRET");

        if (process.env.FAILS_KEYS_SECRET) this.keyssecret=process.env.FAILS_KEYS_SECRET;
        else if (!this.react) throw new Error("Please specifiy FAILS_KEYS_SECRET");

        this.lms_list={};
        if (process.env.FAILS_LMS_LIST)
        {
            let lmss=process.env.FAILS_LMS_LIST.split(' ');
            for (let i=0;i<lmss.length;i++)
            {
                let lms=lmss[i];
                let newone={};
                newone.keyset_url=process.env["FAILS_LMS_"+lms.toUpperCase()+"_KEYSET_URL"];
                newone.access_token_url=process.env["FAILS_LMS_"+lms.toUpperCase()+"_KEYSET_ACCESS_TOKEN_URL"];
                newone.auth_request_url=process.env["FAILS_LMS_"+lms.toUpperCase()+"_AUTH_REQUEST_URL"];
                let name=process.env["FAILS_LMS_"+lms.toUpperCase()+"_NAME"];
                if (!newone.keyset_url || !newone.access_token_url ||
                    ! newone.auth_request_url || !name) {
                        throw new Error("FAILS_LMS "+lms+"not completely set!");
                }
                this.lms_list[name]=newone;
            }
        }
    }

    needCors(){
        if (this.devmode && this.devmode.includes('appweb')) return true;
        else return false; 
    }

    devPorts()
    {
        // default ports for development, if not in container
        return { web: 3000,
            appweb: 1001,
            app: 9092,
            notepad: 9090,
            screen: 9090,
            lti: 9091,
            notes: 9093,
            data: 9092
        };
    }

    getLmsList()
    {
        return this.lms_list;
    }


    getStatSaveType()
    {
        return this.statsavetype;
    }

    getMongoURL()
    {
        return this.mongourl;
    }

    getMongoDB()
    {
        return this.mongoname;
    }

    getWSType()
    {
        return this.statwebservertype;
    }

    getKeysSecret()
    {
        return this.keyssecret;
    }

    getStatSecret()
    {
        return this.staticsecret;
    }

    getPath(type)
    {
        const paths={ web: "static/lecture",
                    app: "app",
                    appweb: "static/app",
                    notepad: "notepads",
                    screen: "screens",
                    notes: "notes",
                    lti: "lti",
                    data: ""};
        if (this.devmode && !(type=='lti')) return "";

        if (paths[type]) {
            return paths[type];
        } else return "";

    }

    getHost()
    {
        return this.host;
    }

    getEHost()
    {
        return this.exthost;
    }

    getSPath(type)
    {
        let path=this.getPath(type);
        if (path=="") return "";
        else return '/'+this.getPath(type);
    }

    getDataDir()
    {
        return 'files';
    }

    getSDataDir()
    {
        return '/'+this.getDataDir();
    }

    getPort(type){
        if (this.devmode && this.devmode.includes(type))
        {
            let name="FAILS_DEV_"+type.toUpperCase()+"_PORT" 
            if (process.env[name]) {
                return process.env[name];
            }
            if (process.env["REACT_APP_"+name]) {
                return process.env["REACT_APP_"+name];
            }
            if (this.devPorts()[type])
                return this.devPorts()[type];
        }
        return 443; // https
    }

    isHttps(port) {
        return port==443;
    }



    getURL(type) {
        let port=this.getPort(type);
        let ishttps=this.isHttps(port);
        if (this.devmode && this.devmode.includes(type)) {
            return ((ishttps)?'https://' : 'http://')+this.host+((port==443)?"":":"+port)+this.getSPath(type);
        } else {
            return this.getPath(type); // relative url
        }
    }
}
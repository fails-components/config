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

export class FailsConfig {
  constructor(args) {
    if (args && args.react) this.react = true

    if (process.env.NODE_ENV === 'development') {
      this.development = true
    }
    if (process.env.FAILS_LOCAL) {
      // string with all modules in debug mode
      this.devmode = process.env.FAILS_LOCAL.split(' ')
    }
    if (process.env.REDIS_HOST) {
      // string with all modules in debug mode
      this.redishost = process.env.REDIS_HOST
    } else {
      this.redishost = '127.0.0.1' // local host is the default
    }

    if (process.env.REDIS_PORT) {
      // string with all modules in debug mode
      this.redisport = process.env.REDIS_PORT
    } else {
      this.redisport = 6379 // default redisport
    }

    if (process.env.REDIS_PASS) {
      // string with all modules in debug mode
      this.redispass = process.env.REDIS_PASS
    }

    if (process.env.REACT_APP_FAILS_LOCAL) {
      // string with all modules in debug mode
      this.devmode = process.env.REACT_APP_FAILS_LOCAL.split(' ')
    }
    // console.log('dev mode', this.devmode)
    // console.log('process env', process.env)
    if (process.env.FAILS_DEV_IPHOST) {
      this.host = process.env.FAILS_DEV_IPHOST
    } else {
      this.host = '0.0.0.0'
    }

    if (process.env.FAILS_EXTERNAL_HOST) {
      this.exthost = process.env.FAILS_EXTERNAL_HOST
    } else {
      this.exthost = this.host
    }

    if (process.env.FAILS_STATIC_WEBSERV_TYPE) {
      this.statwebservertype = process.env.FAILS_STATIC_WEBSERV_TYPE
    } else {
      this.statwebservertype = 'local'
    }

    if (process.env.FAILS_STATIC_SAVE_TYPE) {
      this.statsavetype = process.env.FAILS_STATIC_SAVE_TYPE
    } else {
      this.statsavetype = 'fs'
    }

    if (
      process.env.FAILS_STATIC_WEBSERV_TYPE === 'openstackswift' ||
      process.env.FAILS_STATIC_SAVE_TYPE === 'openstackswift'
    ) {
      this.swift = {}
      const sw = this.swift
      sw.account = process.env.FAILS_SWIFT_ACCOUNT
      sw.container = process.env.FAILS_SWIFT_CONTAINER
      sw.key = process.env.FAILS_SWIFT_KEY
      sw.baseurl = process.env.FAILS_SWIFT_BASEURL
      sw.authbaseurl = process.env.FAILS_SWIFT_AUTH_BASEURL
      sw.username = process.env.FAILS_SWIFT_USERNAME
      sw.password = process.env.FAILS_SWIFT_PASSWORD
      sw.domain = process.env.FAILS_SWIFT_DOMAIN
      sw.project = process.env.FAILS_SWIFT_PROJECT
    }

    if (
      process.env.FAILS_STATIC_WEBSERV_TYPE === 's3' ||
      process.env.FAILS_STATIC_SAVE_TYPE === 's3'
    ) {
      this.s3 = {}
      const s3 = this.s3
      s3.AK = process.env.FAILS_S3_AK
      s3.SK = process.env.FAILS_S3_SK
      s3.region = process.env.FAILS_S3_REGION
      s3.bucket = process.env.FAILS_S3_BUCKET
      s3.host = process.env.FAILS_S3_HOST
      s3.alturl = process.env.FAILS_S3_ALTURL
    }

    if (process.env.FAILS_MONGO_URL) this.mongourl = process.env.FAILS_MONGO_URL
    else this.mongourl = 'mongodb://localhost:27017'

    if (process.env.FAILS_MONGO_DBNAME)
      this.mongoname = process.env.FAILS_MONGO_DGNAME
    else this.mongoname = 'fails'

    if (process.env.FAILS_STATIC_SECRET)
      this.staticsecret = process.env.FAILS_STATIC_SECRET
    else if (!this.react) throw new Error('Please specifiy FAILS_STATIC_SECRET')

    if (process.env.FAILS_KEYS_SECRET)
      this.keyssecret = process.env.FAILS_KEYS_SECRET
    else if (!this.react) throw new Error('Please specifiy FAILS_KEYS_SECRET')

    this.lms_list = {}
    if (process.env.FAILS_LMS_LIST) {
      const lmss = process.env.FAILS_LMS_LIST.split(' ')
      for (let i = 0; i < lmss.length; i++) {
        const lms = lmss[i]
        const lmsarr = lms.split('|')
        if (lmsarr.length !== 5) throw new Error('FAILS_LMS_LIST wrong format')
        const newone = {}
        newone.keyset_url = lmsarr[1]
        newone.access_token_url = lmsarr[2]

        newone.auth_request_url = lmsarr[3]
        const name = lmsarr[4]
        if (
          !newone.keyset_url ||
          !newone.access_token_url ||
          !newone.auth_request_url ||
          !name
        ) {
          throw new Error('FAILS_LMS ' + lms + 'not completely set!')
        }
        this.lms_list[name] = newone
      }
    }

    if (process.env.FAILS_LMS_COURSE_WHITELIST) {
      this.courseidWhitelist = process.env.FAILS_LMS_COURSE_WHITELIST.split(' ')
    }

    if (process.env.FAILS_ONLY_LEARNERS === '1') {
      this.onlylearners = true
    } else {
      this.onlylearners = false
    }
  }

  onlyLearners() {
    return this.onlylearners
  }

  courseWhitelist() {
    return this.courseidWhitelist
  }

  redisHost() {
    return this.redishost
  }

  redisPort() {
    return this.redisport
  }

  redisPass() {
    return this.redispass
  }

  needCors() {
    if (this.devmode && this.devmode.includes('appweb')) return true
    else return false
  }

  devPorts() {
    // default ports for development, if not in container
    return {
      web: 3000,
      appweb: 1001,
      app: 9092,
      notepad: 9090,
      screen: 9090,
      lti: 9091,
      notes: 9093,
      data: 9092,
      avsdispatcher: 9093
    }
  }

  getLmsList() {
    return this.lms_list
  }

  getStatSaveType() {
    return this.statsavetype
  }

  getMongoURL() {
    return this.mongourl
  }

  getMongoDB() {
    return this.mongoname
  }

  getWSType() {
    return this.statwebservertype
  }

  getKeysSecret() {
    return this.keyssecret
  }

  getStatSecret() {
    return this.staticsecret
  }

  getPath(type, branch) {
    const paths = {
      web: 'static/lecture/',
      app: 'app',
      appweb: 'static/app/',
      notepad: '',
      screen: '',
      notes: '',
      lti: 'lti',
      data: '',
      avsdispatcher: 'avs'
    }
    if (this.devmode && !(type === 'lti' || type === 'avsdispatcher')) return ''

    let toret
    if (paths[type]) {
      toret = paths[type]
    } else toret = ''

    if (branch && branch !== 'stable') {
      toret = toret.replace('static/', 'static/' + branch + '/')
    }

    return toret
  }

  getHost() {
    return this.host
  }

  getEHost() {
    return this.exthost
  }

  getSPath(type, branch) {
    const path = this.getPath(type, branch)
    if (path === '') return ''
    else return '/' + this.getPath(type, branch)
  }

  getDataDir() {
    return 'files'
  }

  getSDataDir() {
    return '/' + this.getDataDir()
  }

  getPort(type) {
    if (this.devmode && this.devmode.includes(type)) {
      const name = 'FAILS_DEV_' + type.toUpperCase() + '_PORT'
      if (process.env[name]) {
        return process.env[name]
      }
      if (process.env['REACT_APP_' + name]) {
        return process.env['REACT_APP_' + name]
      }
      if (this.devPorts()[type]) return this.devPorts()[type]
    }
    return 443 // https
  }

  getSwift() {
    return this.swift
  }

  getS3() {
    return this.s3
  }

  isHttps(port) {
    return port === 443
  }

  getURL(type, branch) {
    const port = this.getPort(type)
    const ishttps = this.isHttps(port)
    if (this.devmode && this.devmode.includes(type)) {
      return (
        (ishttps ? 'https://' : 'http://') +
        this.host +
        (port === 443 ? '' : ':' + port) +
        this.getSPath(type, branch)
      )
    } else {
      return '/' + this.getPath(type, branch) // absolute url without domain
    }
  }
}

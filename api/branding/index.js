(function (){
  'use strict';

  var async     = require("async")
    , express   = require("express")
    , request   = require("request")
    , helpers   = require("../../helpers")
    , config    = require("../../config")
    , endpoints = require("../endpoints")
    , app       = express()
    , fs        = require('fs')
    , busboy    = require('express-busboy');

  busboy.extend(app, {
    upload: true,
    path: '/tmp/logo',
    allowedPath: /./
  });

  app.post("/branding", function (req, res, next) {
    if (config.branding.set == true) {
      res.redirect("/");
      return;
    } else {
      console.log(req.body.brand);
      if (req.body.brand !== undefined) {
        var brand = req.body.brand;
        var image;

        if (brand == "cncf") {
          image = "./public/img/cncf-logo.png";
          config.branding.set = true;
          config.branding.values.name = "cncf";
          config.branding.values.company = "Cloud Native Computing Foundation c/o The Linux Foundation";
          config.branding.values.street = "1 Letterman Drive Suite D4700";
          config.branding.values.city = "San Francisco";
          config.branding.values.state = "CA";
          config.branding.values.zip = "94129";
          config.branding.values.country = "USA";
        } else if (brand == "weave") {
          image = "./public/img/weave-logo.png";
          config.branding.set = true;
          config.branding.values.name = "weave";
          config.branding.values.company = "Weaveworks Ltd.";
          config.branding.values.street = "32 – 38 Scrutton Street";
          config.branding.values.city = "London";
          config.branding.values.zip = "EC2A 4RQ";
          config.branding.values.country = "UK";
        } else if (brand == "other") {
          config.branding.set = true;
          config.branding.values.name = "other";
          console.log(req.files.logo.file);
          if (req.files.logo == undefined) {
            res.redirect("/welcome.html");
            return;
          }
          image = req.files.logo.file;
          config.branding.values.company = req.body.company;
          config.branding.values.street = req.body.street;
          config.branding.values.city = req.body.city;
          config.branding.values.zip = req.body.zip;
          config.branding.values.state = req.body.state;
          config.branding.values.country = req.body.country;
        }
        else {
          res.redirect("/welcome.html");
          return;
        }
        config.branding.values.logo = fs.readFileSync(image).toString("base64");
        res.redirect("/");
        return;
      } else {
        res.redirect("/welcome.html");
        return;
      }
    }
  });

  app.get("/img/logo*", function (req, res, next) {
    console.log("fired")
    var buf = new Buffer(config.branding.values.logo, 'base64');
    res.writeHead(200, {
      'Content-Type': "image/png",
      'Content-disposition': 'attachment;filename=logo.png',
      'Content-Length': buf.length
    });
    res.end(new Buffer(buf, 'binary'));
  });

  app.get('/footer.html', function (req, res) {
    res.render('footer', config.branding.values);
  });

  module.exports = app;
}());

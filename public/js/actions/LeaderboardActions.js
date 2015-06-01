'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var instagramKey = process.env.INSTAGRAM_CLIENT_ID || require('../../env/config.js').INSTAGRAM_CLIENT_ID;
var async = require('async');

var instagramTokenLabel = 'client_id=';

var LeaderboardActions = {


getPics: function(topScorers){

  var callforImages= function(item, next){

      if(!item.instagramID){

        var photoInfo = {
          id: item.username, 
          src: '../asset/CoderGirl0101.png', 
          title: '',
          score: item.score,
          username: item.username
        }

        next(null, photoInfo);


      } else {

        var topUserInstagramID = item.instagramID;
        var url = 'https://api.instagram.com/v1/users/' + topUserInstagramID + '/media/recent/?' + instagramTokenLabel + instagramKey;
        $.ajax({
          url: url,
          dataType: 'jsonp',
          type: 'GET',
          success: function(result){

            if(!result.data){
                console.log("Error message from Instagram:", result.meta.error_message);
                var photoInfo = {
                  id: item.username, 
                  src: '../asset/CoderGirl0101.png', 
                  title: '',
                  score: item.score,
                  username: item.username
                }
                next(null, photoInfo);
            } else {

                var photoInfo = { 
                        instagramUsername: result.data[0].user.username,
                        id: item.username, 
                        url: result.data[0].link, 
                        src: result.data[0].images.low_resolution.url, 
                        title: result.data[0].caption ? result.data[0].caption.text : '',
                        score: item.score,
                        username: item.username
                      }
                next(null, photoInfo);

              }

            },
            error: function(xhr, status, error){
              console.error(xhr, status, error)
              next(error);
            }
          })





      }

  };
    

  async.map(topScorers, callforImages, function(err, results){
    console.log(err)
    AppDispatcher.handleServerAction({
      actionType: AppConstants.GET_PICS,
      data: results
    })


  })





    // var pictures = [];

    // for(var i=0; i< topScorers.length; i++){
    //   if(!topScorers[i].instagramID){

    //   //Handle case where no instagramID

    //     var score = topScorers[i].score;
    //     var username = topScorers[i].username;

    //     pictures.push({ 
    //             id: i, 
    //             src: '../asset/CoderGirl0101.png', 
    //             title: '',
    //             score: score,
    //             username: username
    //         });

    //     //Send the updated picture array through the dispatcher to the LeaderboardStore

    //     AppDispatcher.handleServerAction({
    //       actionType: AppConstants.GET_PICS,
    //       data: pictures
    //     })

    //   } else {

    //     var topUserInstagramID = topScorers[i].instagramID;
    //     var url = 'https://api.instagram.com/v1/users/' + topUserInstagramID + '/media/recent/?' + instagramTokenLabel + instagramKey;
    //     var score = topScorers[i].score;
    //     var username = topScorers[i].username;
    //     $.ajax({
    //       url: url,
    //       dataType: 'jsonp',
    //       type: 'GET',
    //       success: function(result){

    //         if(!result.data){
    //             console.log("Error message from Instagram:", result.meta.error_message);
    //             return;
    //         } else {

    //             console.log("topScorer in ajax", topScorers)

    //             pictures.push({ 
    //                     instagramUsername: result.data[0].user.username,
    //                     id: i, 
    //                     url: result.data[0].link, 
    //                     src: result.data[0].images.low_resolution.url, 
    //                     title: result.data[0].caption ? result.data[0].caption.text : '',
    //                     score: score,
    //                     username: username
    //                 });

    //             console.log(pictures)


    //             //Send the updated picture array through the dispatcher to the LeaderboardStore

    //             AppDispatcher.handleServerAction({
    //               actionType: AppConstants.GET_PICS,
    //               data: pictures
    //             })

    //           }

    //         },
    //         error: function(xhr, status, error){
    //           console.error(xhr, status, error)
    //         }
    //       })

    //     } 

    //   }

    },


  getTopScorers: function(){

    var self = this;

    $.ajax({
      url: '/api/users/leaders',
      dataType: 'json',
      type: 'GET',
      success: function(data){
          
        //Once get leaders, call to instagram to get photos.  Data is an array of objcts containing instagramUserID, CoderGirlusername, and score.
        self.getPics(data);
        
      },
      error: function(xhr, status, error){
        console.error(xhr, status, error)
      }.bind(this) 
    })

  },

  getAccessToken: function(username){
    var self = this;

    $.ajax({
      url: '/api/users/instagramKey',
      data: { name: username },
      dataType: 'json',
      type: 'GET',
      success: function(data){

        //If received the current user's instagram token back from server, change the 
        //instagram key to the user's token and change the lable in the URL to access_token

        if(data){
          instagramKey = data;
          instagramTokenLabel = 'access_token='
        }

        //Call to server to get leaders
        self.getTopScorers();

      },
      error: function(xhr, status, error){
        console.error(xhr, status, error)
        
        self.getTopScorers();

      }.bind(this) 
    })
  }

};

module.exports = LeaderboardActions;


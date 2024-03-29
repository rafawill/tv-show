app.controller("mainController", function($scope, $http){
//7595a04663b32415b8e1966e5f97ac89
	$scope.apiKey = "7595a04663b32415b8e1966e5f97ac89";
	$scope.results = [];
	$scope.filterText = null;
	$scope.availableGenres = [];
    $scope.genreFilter = null;
    $scope.orderFields = ["Air Date", "Rating"];
	$scope.orderDirections = ["Descending", "Ascending"];
	$scope.orderField = "Air Date"; //Default order field
	$scope.orderReverse = false;
    $scope.init = function() {
    	//API requires a start date
        var today = new Date();
        //Create the date string and ensure leading zeros if required
        var apiDate = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);
        $http.jsonp('http://api.trakt.tv/calendar/premieres.json/' + $scope.apiKey + '/' + apiDate + '/' + 30 + '/?callback=JSON_CALLBACK').success(function(data) {
            //As we are getting our data from an external source, we need to format the data so we can use it to our desired effect
            //For each day, get all the episodes
            angular.forEach(data, function(value, index){
                //The API stores the full date separately from each episode. Save it so we can use it later
                var date = value.date;
                //For each episodes, add it to the results array
                angular.forEach(value.episodes, function(tvshow, index){
                    //Create a date string from the timestamp so we can filter on it based on user text input
                    tvshow.date = date; //Attach the full date to each episode
                    $scope.results.push(tvshow);
                    angular.forEach(tvshow.show.genres, function(genre, index){
                        //Only add to the availableGenres array if it doesn't already exist
                        var exists = false;
                        angular.forEach($scope.availableGenres, function(avGenre, index){
                            if (avGenre == genre) {
                                exists = true;
                            }
                        });
                        if (exists === false) {
                            $scope.availableGenres.push(genre);
                        }
                    });
                });
            });
        }).error(function(error) {
 
        });
    };

    $scope.setGenreFilter = function(genre) {
    $scope.genreFilter = genre;
    }

    $scope.customOrder = function(tvshow) {
    switch ($scope.orderField) {
        case "Air Date":
            return tvshow.episode.first_aired;
            break;
        case "Rating":
            return tvshow.episode.ratings.percentage;
            break;
    }
};

});

app.filter('isGenre', function() {
    return function(input, genre) {
        if (typeof genre == 'undefined' || genre == null) {
            return input;
        } else {
            var out = [];
            for (var a = 0; a < input.length; a++){
                for (var b = 0; b < input[a].show.genres.length; b++){
                    if(input[a].show.genres[b] == genre) {
                        out.push(input[a]);
                    }
                }
            }
            return out;
        }
    };
});


﻿/**
 * ------------------------------------------------------------
 * Copyright (c) 2011 Artem Matevosyan
 * ------------------------------------------------------------
 *
 * @version $Revision: 138 $:
 * @author  $Author: mart $:
 * @date    $Date: 2011-10-31 10:35:07 +0100 (Mo, 31 Okt 2011) $:
 */

#target photoshop

//=============================================================================
// Version Exporter
//=============================================================================

//@include 'include/stdlib.js'
//@include 'include/getSelectedLayers.js'


// Dispatch
main();


///////////////////////////////////////////////////////////////////////////////
// Function:	main
// Usage:		starting script rotine
// Input:		none
// Return:		none
///////////////////////////////////////////////////////////////////////////////
function main(){

	if ( app.documents.length <= 0 ) {
		if ( app.playbackDisplayDialogs != DialogModes.NO ) {
			alert("Document must be opened");
		}
		return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
	}

	var docRef = app.activeDocument;

	var defaultRadius = 5;
	var userRadius = Number(prompt('Please enter the radius for the rounded corners', defaultRadius));
	var radius = userRadius ? userRadius : defaultRadius;

	var layers = getSelectedLayers();

	for (var i=0; i<layers.length; i++){
		var layer = layers[i];
		docRef.activeLayer = layer;
		if (Stdlib.hasVectorMask(docRef, layer)) {
			var bounds = Stdlib.getVectorMaskBounds(docRef, layer);
			Stdlib.removeVectorMask(docRef, layer);
		} else {
			try { // for the case if there is no effects on the layer
				Stdlib.hideLayerEffects(docRef, layer);
			} catch(e){}
			var bounds = Stdlib.getLayerBounds(docRef, layer);
			try { // for the case if there is no effects on the layer
				Stdlib.showLayerEffects(docRef, layer);
			} catch(e){}
		}
		// This fixes an issue for the documents that have resolution other then 72 dpi
		var resolutionRatio = 72 / docRef.resolution;
		makeRCrectangle(bounds[1] * resolutionRatio, bounds[0] * resolutionRatio, bounds[3] * resolutionRatio, bounds[2] * resolutionRatio, radius * resolutionRatio);
		Stdlib.createVectorMaskFromCurrentPath(docRef, layer);
	}

}

function makeRCrectangle( top, left, bottom, right, radius, resolution ){
	  var desc = new ActionDescriptor();
		  var ref1 = new ActionReference();
		  ref1.putProperty( charIDToTypeID( "Path" ), charIDToTypeID( "WrPt" ) );
	  desc.putReference( charIDToTypeID( "null" ), ref1 );
		  var RDRdesc = new ActionDescriptor();
		  RDRdesc.putUnitDouble( charIDToTypeID( "Top " ), charIDToTypeID( "#Rlt" ), top );
		  RDRdesc.putUnitDouble( charIDToTypeID( "Left" ), charIDToTypeID( "#Rlt" ), left );
		  RDRdesc.putUnitDouble( charIDToTypeID( "Btom" ), charIDToTypeID( "#Rlt" ), bottom );
		  RDRdesc.putUnitDouble( charIDToTypeID( "Rght" ), charIDToTypeID( "#Rlt" ), right );
		  RDRdesc.putUnitDouble( charIDToTypeID( "Rds " ), charIDToTypeID( "#Rlt" ), radius );
	  desc.putObject( charIDToTypeID( "T   " ), charIDToTypeID( "Rctn" ), RDRdesc );
  executeAction( charIDToTypeID( "setd" ), desc, DialogModes.NO );
}
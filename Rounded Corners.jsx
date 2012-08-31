/**
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
		makeRCrectangle(bounds[1], bounds[0], bounds[3], bounds[2], radius );
		Stdlib.createVectorMaskFromCurrentPath(docRef, layer);
	}

}

function makeRCrectangle( top, left, bottom, right, radius ){
	  var desc = new ActionDescriptor();
		  var ref1 = new ActionReference();
		  ref1.putProperty( charIDToTypeID( "Path" ), charIDToTypeID( "WrPt" ) );
	  desc.putReference( charIDToTypeID( "null" ), ref1 );
		  var RDRdesc = new ActionDescriptor();
		  RDRdesc.putUnitDouble( charIDToTypeID( "Top " ), charIDToTypeID( "#Rlt" ), top + 0.1);
		  RDRdesc.putUnitDouble( charIDToTypeID( "Left" ), charIDToTypeID( "#Rlt" ), left + 0.1);
		  RDRdesc.putUnitDouble( charIDToTypeID( "Btom" ), charIDToTypeID( "#Rlt" ), bottom + 0.1);
		  RDRdesc.putUnitDouble( charIDToTypeID( "Rght" ), charIDToTypeID( "#Rlt" ), right + 0.1);
		  RDRdesc.putUnitDouble( charIDToTypeID( "Rds " ), charIDToTypeID( "#Rlt" ), radius );
	  desc.putObject( charIDToTypeID( "T   " ), charIDToTypeID( "Rctn" ), RDRdesc );
  executeAction( charIDToTypeID( "setd" ), desc, DialogModes.NO );
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Section - Feature: HTML info
 */

/*
 * Function: _fnFeatureHtmlInfo
 * Purpose:  Generate the node required for the info display
 * Returns:  node
 * Inputs:   object:oSettings - dataTables settings object
 */
function _fnFeatureHtmlInfo ( oSettings )
{
	var nInfo = document.createElement( 'div' );
	nInfo.className = oSettings.oClasses.sInfo;
	
	/* Actions that are to be taken once only for this feature */
	if ( typeof oSettings.aanFeatures.i == "undefined" )
	{
		/* Add draw callback */
		oSettings.aoDrawCallback.push( {
			"fn": _fnUpdateInfo,
			"sName": "information"
		} );
		
		/* Add id */
		if ( oSettings.sTableId !== '' )
		{
			nInfo.setAttribute( 'id', oSettings.sTableId+'_info' );
		}
	}
	
	return nInfo;
}

/*
 * Function: _fnUpdateInfo
 * Purpose:  Update the information elements in the display
 * Returns:  -
 * Inputs:   object:oSettings - dataTables settings object
 */
function _fnUpdateInfo ( oSettings )
{
	/* Show information about the table */
	if ( !oSettings.oFeatures.bInfo || oSettings.aanFeatures.i.length === 0 )
	{
		return;
	}
	
	var
		iStart = oSettings._iDisplayStart+1, iEnd = oSettings.fnDisplayEnd(),
		iMax = oSettings.fnRecordsTotal(), iTotal = oSettings.fnRecordsDisplay(),
		sStart = oSettings.fnFormatNumber( iStart ), sEnd = oSettings.fnFormatNumber( iEnd ),
		sMax = oSettings.fnFormatNumber( iMax ), sTotal = oSettings.fnFormatNumber( iTotal ),
		sOut;
	
	/* When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
	 * internally
	 */
	if ( oSettings.oScroll.bInfinite )
	{
		sStart = oSettings.fnFormatNumber( 1 );
	}
	
	if ( oSettings.fnRecordsDisplay() === 0 && 
		   oSettings.fnRecordsDisplay() == oSettings.fnRecordsTotal() )
	{
		/* Empty record set */
		sOut = oSettings.oLanguage.sInfoEmpty+ oSettings.oLanguage.sInfoPostFix;
	}
	else if ( oSettings.fnRecordsDisplay() === 0 )
	{
		/* Rmpty record set after filtering */
		sOut = oSettings.oLanguage.sInfoEmpty +' '+ 
			oSettings.oLanguage.sInfoFiltered.replace('_MAX_', sMax)+
				oSettings.oLanguage.sInfoPostFix;
	}
	else if ( oSettings.fnRecordsDisplay() == oSettings.fnRecordsTotal() )
	{
		/* Normal record set */
		sOut = oSettings.oLanguage.sInfo.
				replace('_START_', sStart).
				replace('_END_',   sEnd).
				replace('_TOTAL_', sTotal)+ 
			oSettings.oLanguage.sInfoPostFix;
	}
	else
	{
		/* Record set after filtering */
		sOut = oSettings.oLanguage.sInfo.
				replace('_START_', sStart).
				replace('_END_',   sEnd).
				replace('_TOTAL_', sTotal) +' '+ 
			oSettings.oLanguage.sInfoFiltered.replace('_MAX_', 
				oSettings.fnFormatNumber(oSettings.fnRecordsTotal()))+ 
			oSettings.oLanguage.sInfoPostFix;
	}
	
	if ( oSettings.oLanguage.fnInfoCallback !== null )
	{
		sOut = oSettings.oLanguage.fnInfoCallback( oSettings, iStart, iEnd, iMax, iTotal, sOut );
	}
	
	var n = oSettings.aanFeatures.i;
	for ( var i=0, iLen=n.length ; i<iLen ; i++ )
	{
		$(n[i]).html( sOut );
	}
}

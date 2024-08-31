App = {
    
    loading:false,

    render: async () => {
        if(App.loading) {
            return;
        }
        $('#account').html(App.account);
        await App.listAllTenders();
        await App.listMyBids();
       
        await App.listMyTenders();
    },

    listAllTenders: async () => {
        const tenderCount = await App.TenderAuction.tenderCount();
        for(i = 1; i <= tenderCount; i++) {
            const tender = await App.TenderAuction.tenders(i);
            const tenderTemplate = `<tr style="text-align:center">
                                        <td>${tender[0]}</td>
                                        <td>${tender[1]}</td>
                                        <td>${tender[2]}</td>
                                        <td>${tender[3]}</td>
                                        <td>${tender[4]}</td>
                                        <td>${tender[5]}</td>
                                        <td><button onclick="popup('${tender[0]}')" class="btn btn-success">Bid</button></td>
                                        
                                    <tr>`;
            
            const tenderPopupTemplate = `<div class="abc" id="tenderId${tender[0]}">
				
                                            <br><br><br>
                                            
                                            <span onclick="div_hide('${tender[0]}')" style="float:right" class="x">X</span>

                                            <div style="margin-top:20px; width: 550px;" class="container card w3-section">
                                                
                                                <span><b>Tender ID: </b>${tender[0]}</span>
                                                <span><b>Tender Name: </b>${tender[1]}</span>
                                                <span><b>Length of road to be Constructed (km) : </b>${tender[3]}</span>
                                                <span><b>Uploader Address: </b>${tender[6]}</span>

                                                <hr>

                                                <center style="margin-bottom:10px;">
                                                    <input class="form-control" type="number" style="margin-bottom:10px;" id="ppi${tender[0]}" placeholder="Bid Price for Tender">
                                                    <button class="w3-button w3-green" style="width:150px;" onclick="App.makeBid(${tender[0]});">Make a Bid</button>
                                                </center>

                                            </div>
                                            
                                        </div>`

            $("#allTenders").append(tenderTemplate);
            $("#tenderPopup").append(tenderPopupTemplate);          
        }
    },

    listMyBids: async () => {
        
        const bidCount = await App.TenderAuction.bidCount();
        for(i = 1; i <= bidCount; i++) {
            const bid = await App.TenderAuction.bids(i); 
            if(bid[4] == App.account) {
                console.log(App.account)
                var checkbiddername = bid[2];
                var checkbidvalue = null;
                checkbidvalue = bid[3];
                const bidTemplate = `<tr style="text-align:center">
                                            <td>${bid[0]}</td>
                                            <td>${bid[2]}</td>
                                            <td>${bid[3]}</td>
                                            <td><button class="w3-button w3-green" style="width:120px; height: 50px;" onclick="App.showNotif('${checkbiddername}' , '${checkbidvalue}');">Check Status</button></td>
                                        </tr>`;
                $("#myBids").append(bidTemplate);
            }
        }
    },

    makeBid: async (id) => {
        App.setLoading(true);
        const bid = $("#ppi"+id).val();
        App.TenderAuction.createBid(id, bid, {from:App.account});
    },

showNotif: async (val , val1) => {
    // var account = null;
    // signature = null;
    // account = App.account;
    // signature = await (App.approveBids.signature);
    // customAlert.alert(" Your bid has been accepted, and the Signature is: ");

    let checksign = localStorage.getItem('Signaturestorage');
    var useforcomparebidname = val;
    var checkbidvalueuse = val1;
    let checknamecompare = localStorage.getItem('usethisfortendername');
    let checkbidvaluecompare = localStorage.getItem('bidvalueuse');

    console.log("checking for last step" + useforcomparebidname);
    console.log("same as above" + checknamecompare);
    console.log("checking for bid value" + checkbidvalueuse)
    console.log("check bid value " + checkbidvaluecompare);

    // if(checknamecompare != useforcomparebidname){
    //     customAlert.alert(" Your bid is still being processed");
    // }
     if(checknamecompare == useforcomparebidname && checkbidvalueuse == checkbidvaluecompare){
        customAlert.alert(" Your bid has been accepted, and the Signature is (Comparison done 1 ) : " + checksign.substring(0,50))
    }

    else if(checknamecompare == null && checkbidvalueuse == checkbidvaluecompare){
        customAlert.alert(" Your bid has been accepted, and the Signature is (Comparison done 2 ) : " + checksign.substring(0,50))
    }

    else if(checknamecompare == null && checkbidvalueuse == null){
        customAlert.alert(" Your bid has been accepted, and the Signature is (Comparison done 3 ) : " + checksign.substring(0,50))
    }

    else if(checknamecompare != useforcomparebidname){
        customAlert.alert(" Your bid is still being processed");
    }
    


    else{
        // customAlert.alert(" Your bid has been accepted, and the Signature is: " + checksign.substring(0,50));

        customAlert.alert("error occured try again");
    }
   
    console.log("test");
  

},
    
    
    setLoading: (boolean) => {
        App.loading = boolean;
        const loader = $('#loading');
        const content = $('#content');
        if(boolean) {
            loader.show();
            content.hide();
        }else {
            loader.hide();
            content.show();
        }
    }

}

function showAllTenders() {
    console.log("#bidlist");
    $("#bidList").hide();
    $("#listAllTenders").show();
}

function showBids() {
    $("#bidList").show();
    $("#listAllTenders").hide();
    
}

function showNotif() {
//     let checksign = localStorage.getItem('Signaturestorage');
//     if(checksign == null){
//         customAlert.alert(" Your bid is still beign processed");
//     }
//     else{
//         customAlert.alert(" Your bid has been accepted, and the Signature is: " + checksign);
//     }
   
    console.log("test");
     
    }

function popup(id) {
    $("#tenderId"+id).show();
}

function div_hide(id) {
    $("#tenderId"+id).hide();
}

console.log("#bidlist");

App = {
    
    loading:false,

    render: async () => {
        if(App.loading) {
            return;
        }
        $('#account').html(App.account);
        await App.listMyTenders();
        await App.showAllBids();
        
    },

    listMyTenders: async () => {
        const tenderCount = await App.TenderAuction.tenderCount();
        console.log("My tenders");
        for(i = 1; i <= tenderCount; i++) {
            const tender = await App.TenderAuction.tenders(i);
            if(tender[6] == App.account) {
                const tenderTemplate = `<tr style="text-align:center">
                                            <td>${tender[0]}</td>
                                            <td>${tender[1]}</td>
                                            <td>${tender[2]}</td>
                                            <td>${tender[3]}</td>
                                            <td>${tender[4]}</td>      
                                            <td>${tender[5]}</td>     
                                        </tr>`;
                $("#mytenders").append(tenderTemplate);
            }
        }
    },

    submitTender: async () => {
        App.setLoading(true);
        const itemName = $("#itemName").val();
        const itemDesc = $("#itemDesc").val();
        const itemQuantity = $("#itemQuantity").val();
        const area = $("#area").val();
        const deadline = $('#deadline').val();
        console.log(deadline);
        const deadline1 = deadline.replaceAll('-', '');     
        console.log(deadline1);

        try{
            await App.TenderAuction.createTender(itemName, itemDesc, itemQuantity, area, deadline1, {from:App.account});
            window.location.reload();
        }catch{
            window.location.reload();
        }
        console.log(deadline);
    },

    showAllBids: async () => {
     
        console.log("hello world");
        const bidCount = await App.TenderAuction.bidCount();
        for(i = 1; i <= bidCount; i++) {
            console.log("here 2");
            const tender = await App.TenderAuction.tenders(i);
            const bid = await App.TenderAuction.bids(i);
             var   tendernameacceptedstorage = tender[1];
             var abcd = tender[1];
             var efgh = bid[3];

             console.log(">>>>>>>>>>>>>>>>>>" + tender[1]);
            console.log(bid);
            localStorage.setItem("Bidaccepted" , tender[1] );
            let acceptedtendername = localStorage.getItem('Bidaccepted')
           // if(tender[4] == App.account) {
                console.log("55555");             
                const bidTemplate = `<tr style="text-align:center">
                                            <td class="idclass">${bid[0]}</td>
                                            <td>${tender[1]}</td>
                                            <td>${bid[3]}</td>
                                            <td>${tender[3]}</td>
                                            <td>${tender[2]}</td>
                                            <td>${bid[4]}</td>
                                            <td>${tender[4]}</td>
                                            <td><button class="w3-button w3-green" style="width:120px; height: 50px;" onclick="App.approveBids('${abcd}' , '${efgh}') " >Accept Bids</button></td>
                                            <td>
                                        </tr>`;
                var idnumber = [];
                idnumber.push(bid[0]);
                console.log(idnumber);
      $("#bidList").append(bidTemplate);
      
            //}
        }
        
        
        
 },

 approveBids: async (val , val1  ) => {
    /*const $idnumber = $(this).closest("tr")   // Finds the closest row <tr> 
    .find(".idclass")     // Gets a descendent with class="nr"
    .text();         // Retrieves the text wireathin <td>
    console.log("id number is " + $idnumber);*/
    // let idclass = $(this).closest("tr");
    //     /*let inum = document.getElementById(bid[0]);
    //     console.log(inum);*/

    //     localStorage.answer = JSON.stringify($idnumber);
    //     let saved = CircularJSON.parse(localStorage.answer);
    //     console.log( saved === $idSnumber ); // trues

    //     console.log("id number is w12313131 " + $idnumber);
    //                 console.log("ehllo3");
    localStorage.removeItem("bidvalueuse");
    var account = null;
    var signature = null;
    var tendername = null;
    var displaysig = null;
    var tendernameuse = val;
    var bidvalue = val1;
    var message = "Please sign this";
    account = App.account;
    signature = await web3.eth.personal.sign(message, account);
    displaysig = signature.substring(0,50);
    customAlert.alert(" Message signed by \n " + account + " and the Signature is: \n \n \n" + displaysig);
  
    localStorage.setItem("Signaturestorage" , signature);
    localStorage.setItem("TenderName"  , tendername);

   
    let checksign = localStorage.getItem('Signaturestorage');
    console.log("bid value checking here" + bidvalue);
    console.log("here is check" + checksign);
    //console.log("here is check for name" + acceptedtendername);
    console.log("project %%%%%%%%%%%%%%%%%%%%%" + tendernameuse);
    localStorage.setItem("usethisfortendername" , tendernameuse);
    localStorage.setItem("bidvalueuse" , bidvalue);


   
        
          // Outputs the answer
          

 
    
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

function uploadTenders() {
    $("#tenderList").hide();
    $("#listAllBids").hide();
    $("#uploadTender").show();
}

function showTenders() {
    $("#tenderList").show();
    $("#uploadTender").hide();
    $("#listAllBids").hide();
}

function showAllBids() {
    console.log("#bidlist");
    $("#tenderList").hide();
    $("#uploadTender").hide();
    $("#listAllBids").show();
}

function approveBids(){
    console.log("here is alert");
    
  
}

import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    books : Map.Map<Nat, { id : Nat; title : Text; author : Text; isbn : Text; genre : Text; description : Text; isAvailable : Bool }>;
    members : Map.Map<Nat, { id : Nat; name : Text; email : Text; membershipId : Text }>;
    borrowingRecords : Map.Map<(Nat, Nat), { bookId : Nat; memberId : Nat; dueDate : Int; borrowedAt : Int; isReturned : Bool }>;
    events : Map.Map<Nat, { id : Nat; title : Text; date : Int; time : Text; description : Text }>;
    contactMessages : Map.Map<Nat, { name : Text; email : Text; message : Text; timestamp : Int }>;
    userProfiles : Map.Map<Principal, { name : Text; email : Text; preferences : Text }>;
    nextBookId : Nat;
    nextMemberId : Nat;
    nextEventId : Nat;
    libraryInformation : ?{
      name : Text;
      address : Text;
      phoneNumber : Text;
      email : Text;
      mission : Text;
      history : Text;
      services : [Text];
      openingHours : [(Text, Text)];
    };
  };

  type NewActor = {
    farmerProfiles : Map.Map<Principal, { id : Nat; name : Text; location : Text; landSize : Float; preferredLanguage : Text }>;
    cropAdvisories : Map.Map<Nat, { id : Nat; crop : Text; guidance : Text; season : Text }>;
    mandiPrices : Map.Map<Nat, { id : Nat; crop : Text; price : Int; location : Text }>;
    governmentSchemes : Map.Map<Nat, { id : Nat; name : Text; description : Text; eligibility : Text }>;
    soilReports : Map.Map<Nat, { id : Nat; farmerId : Nat; owner : Principal; ph : Float; nutrients : Text; recommendations : Text }>;
    expertQueries : Map.Map<Nat, { id : Nat; farmerId : Nat; owner : Principal; question : Text; attachment : ?Text; response : ?Text }>;
  };

  // This intentionally resets non-admin state because old state is not compatible.
  public func run(_old : OldActor) : NewActor {
    {
      farmerProfiles = Map.empty<Principal, { id : Nat; name : Text; location : Text; landSize : Float; preferredLanguage : Text }>();
      cropAdvisories = Map.empty<Nat, { id : Nat; crop : Text; guidance : Text; season : Text }>();
      mandiPrices = Map.empty<Nat, { id : Nat; crop : Text; price : Int; location : Text }>();
      governmentSchemes = Map.empty<Nat, { id : Nat; name : Text; description : Text; eligibility : Text }>();
      soilReports = Map.empty<Nat, { id : Nat; farmerId : Nat; owner : Principal; ph : Float; nutrients : Text; recommendations : Text }>();
      expertQueries = Map.empty<Nat, { id : Nat; farmerId : Nat; owner : Principal; question : Text; attachment : ?Text; response : ?Text }>();
    };
  };
};

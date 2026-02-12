import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  type FarmerId = Nat;
  type AdvisoryId = Nat;
  type PriceId = Nat;
  type SchemeId = Nat;
  type SoilReportId = Nat;
  type QueryId = Nat;

  // Agriculture-Specific Types
  public type FarmerProfile = {
    id : FarmerId;
    name : Text;
    location : Text;
    landSize : Float;
    preferredLanguage : Text;
  };

  public type CropAdvisory = {
    id : AdvisoryId;
    crop : Text;
    guidance : Text;
    season : Text;
  };

  public type MandiPrice = {
    id : PriceId;
    crop : Text;
    price : Int;
    location : Text;
  };

  public type GovernmentScheme = {
    id : SchemeId;
    name : Text;
    description : Text;
    eligibility : Text;
  };

  public type SoilReport = {
    id : SoilReportId;
    farmerId : FarmerId;
    owner : Principal;
    ph : Float;
    nutrients : Text;
    recommendations : Text;
  };

  public type ExpertQuery = {
    id : QueryId;
    farmerId : FarmerId;
    owner : Principal;
    question : Text;
    attachment : ?Text;
    response : ?Text;
  };

  public type UserProfile = {
    name : Text;
    location : Text;
    landSize : Float;
    preferredLanguage : Text;
  };

  var nextFarmerId : FarmerId = 1;
  var nextAdvisoryId : AdvisoryId = 1;
  var nextPriceId : PriceId = 1;
  var nextSchemeId : SchemeId = 1;
  var nextSoilReportId : SoilReportId = 1;
  var nextQueryId : QueryId = 1;

  // Storage
  let farmerProfiles = Map.empty<Principal, FarmerProfile>();
  let cropAdvisories = Map.empty<AdvisoryId, CropAdvisory>();
  let mandiPrices = Map.empty<PriceId, MandiPrice>();
  let governmentSchemes = Map.empty<SchemeId, GovernmentScheme>();
  let soilReports = Map.empty<SoilReportId, SoilReport>();
  let expertQueries = Map.empty<QueryId, ExpertQuery>();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?FarmerProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    farmerProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?FarmerProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    farmerProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    let existingProfile = farmerProfiles.get(caller);
    let id = switch (existingProfile) {
      case (?existing) { existing.id };
      case null {
        let newId = nextFarmerId;
        nextFarmerId += 1;
        newId;
      };
    };

    let farmerProfile : FarmerProfile = {
      id;
      name = profile.name;
      location = profile.location;
      landSize = profile.landSize;
      preferredLanguage = profile.preferredLanguage;
    };

    farmerProfiles.add(caller, farmerProfile);
  };

  // Crop Advisory Management (Admin-only CRUD)
  public shared ({ caller }) func addCropAdvisory(crop : Text, guidance : Text, season : Text) : async AdvisoryId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let id = nextAdvisoryId;
    nextAdvisoryId += 1;

    let advisory : CropAdvisory = {
      id;
      crop;
      guidance;
      season;
    };

    cropAdvisories.add(id, advisory);
    id;
  };

  public shared ({ caller }) func updateCropAdvisory(id : AdvisoryId, crop : Text, guidance : Text, season : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (cropAdvisories.get(id)) {
      case null { Runtime.trap("Advisory not found") };
      case (?_) {
        let advisory : CropAdvisory = {
          id;
          crop;
          guidance;
          season;
        };
        cropAdvisories.add(id, advisory);
      };
    };
  };

  public shared ({ caller }) func deleteCropAdvisory(id : AdvisoryId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    cropAdvisories.remove(id);
  };

  public query func getCropAdvisories() : async [CropAdvisory] {
    cropAdvisories.values().toArray();
  };

  public query func getCropAdvisory(id : AdvisoryId) : async ?CropAdvisory {
    cropAdvisories.get(id);
  };

  // Mandi Price Management (Admin-only CRUD)
  public shared ({ caller }) func addMandiPrice(crop : Text, price : Int, location : Text) : async PriceId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let id = nextPriceId;
    nextPriceId += 1;

    let mandiPrice : MandiPrice = {
      id;
      crop;
      price;
      location;
    };

    mandiPrices.add(id, mandiPrice);
    id;
  };

  public shared ({ caller }) func updateMandiPrice(id : PriceId, crop : Text, price : Int, location : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (mandiPrices.get(id)) {
      case null { Runtime.trap("Price entry not found") };
      case (?_) {
        let mandiPrice : MandiPrice = {
          id;
          crop;
          price;
          location;
        };
        mandiPrices.add(id, mandiPrice);
      };
    };
  };

  public shared ({ caller }) func deleteMandiPrice(id : PriceId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    mandiPrices.remove(id);
  };

  public query func getMandiPrices() : async [MandiPrice] {
    mandiPrices.values().toArray();
  };

  public query func getMandiPrice(id : PriceId) : async ?MandiPrice {
    mandiPrices.get(id);
  };

  // Government Scheme Management (Admin-only CRUD)
  public shared ({ caller }) func addGovernmentScheme(name : Text, description : Text, eligibility : Text) : async SchemeId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let id = nextSchemeId;
    nextSchemeId += 1;

    let scheme : GovernmentScheme = {
      id;
      name;
      description;
      eligibility;
    };

    governmentSchemes.add(id, scheme);
    id;
  };

  public shared ({ caller }) func updateGovernmentScheme(id : SchemeId, name : Text, description : Text, eligibility : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (governmentSchemes.get(id)) {
      case null { Runtime.trap("Scheme not found") };
      case (?_) {
        let scheme : GovernmentScheme = {
          id;
          name;
          description;
          eligibility;
        };
        governmentSchemes.add(id, scheme);
      };
    };
  };

  public shared ({ caller }) func deleteGovernmentScheme(id : SchemeId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    governmentSchemes.remove(id);
  };

  public query func getGovernmentSchemes() : async [GovernmentScheme] {
    governmentSchemes.values().toArray();
  };

  public query func getGovernmentScheme(id : SchemeId) : async ?GovernmentScheme {
    governmentSchemes.get(id);
  };

  // Soil Report Management (User-owned, admin can view all)
  public shared ({ caller }) func addSoilReport(ph : Float, nutrients : Text, recommendations : Text) : async SoilReportId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add soil reports");
    };

    let profile = farmerProfiles.get(caller);
    let farmerId = switch (profile) {
      case (?p) { p.id };
      case null { Runtime.trap("User profile not found. Please create a profile first.") };
    };

    let id = nextSoilReportId;
    nextSoilReportId += 1;

    let soilReport : SoilReport = {
      id;
      farmerId;
      owner = caller;
      ph;
      nutrients;
      recommendations;
    };

    soilReports.add(id, soilReport);
    id;
  };

  public query ({ caller }) func getSoilReports() : async [SoilReport] {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      soilReports.values().toArray();
    } else if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      soilReports.values().filter(func(report : SoilReport) : Bool {
        report.owner == caller;
      }).toArray();
    } else {
      Runtime.trap("Unauthorized: Only authenticated users can view soil reports");
    };
  };

  public query ({ caller }) func getSoilReport(id : SoilReportId) : async ?SoilReport {
    switch (soilReports.get(id)) {
      case null { null };
      case (?report) {
        if (report.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?report;
        } else {
          Runtime.trap("Unauthorized: Can only view your own soil reports");
        };
      };
    };
  };

  // Expert Query Management (User-owned, admin can view and respond to all)
  public shared ({ caller }) func submitExpertQuery(question : Text, attachment : ?Text) : async QueryId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit queries");
    };

    let profile = farmerProfiles.get(caller);
    let farmerId = switch (profile) {
      case (?p) { p.id };
      case null { Runtime.trap("User profile not found. Please create a profile first.") };
    };

    let id = nextQueryId;
    nextQueryId += 1;

    let expertQuery : ExpertQuery = {
      id;
      farmerId;
      owner = caller;
      question;
      attachment;
      response = null;
    };

    expertQueries.add(id, expertQuery);
    id;
  };

  public shared ({ caller }) func respondToExpertQuery(id : QueryId, response : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can respond to queries");
    };

    switch (expertQueries.get(id)) {
      case null { Runtime.trap("Query not found") };
      case (?expertQuery) {
        let updatedQuery : ExpertQuery = {
          id = expertQuery.id;
          farmerId = expertQuery.farmerId;
          owner = expertQuery.owner;
          question = expertQuery.question;
          attachment = expertQuery.attachment;
          response = ?response;
        };
        expertQueries.add(id, updatedQuery);
      };
    };
  };

  public query ({ caller }) func getExpertQueries() : async [ExpertQuery] {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      expertQueries.values().toArray();
    } else if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      expertQueries.values().filter(func(expertQuery : ExpertQuery) : Bool {
        expertQuery.owner == caller;
      }).toArray();
    } else {
      Runtime.trap("Unauthorized: Only authenticated users can view expert queries");
    };
  };

  public query ({ caller }) func getExpertQuery(id : QueryId) : async ?ExpertQuery {
    switch (expertQueries.get(id)) {
      case null { null };
      case (?expertQuery) {
        if (expertQuery.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?expertQuery;
        } else {
          Runtime.trap("Unauthorized: Can only view your own queries");
        };
      };
    };
  };

  // Migration Helper Function (for admin to inspect migration result)
  public query ({ caller }) func getMigrationResult() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };
};

/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type MapMarkerList_viewer = {|
  +allPlaces: {|
    +edges: ?$ReadOnlyArray<?{|
      +node: {|
        +id: string;
        +name: string;
        +latitude: number;
        +longitude: number;
        +description: string;
        +address: string;
        +address2: ?string;
        +city: string;
        +state: string;
        +zip: string;
        +rooms: number;
        +needApproval: boolean;
        +phone: ?string;
        +url: ?string;
        +email: ?string;
        +schedules: ?{|
          +edges: ?$ReadOnlyArray<?{|
            +node: {|
              +id: string;
              +day: number;
              +startTime: string;
              +endTime: string;
            |};
          |}>;
        |};
        +images: ?$ReadOnlyArray<string>;
        +type: {|
          +id: string;
          +name: string;
        |};
        +reviews: ?{|
          +edges: ?$ReadOnlyArray<?{|
            +node: {|
              +id: string;
              +rate: number;
              +description: ?string;
              +postedBy: {|
                +id: string;
                +name: string;
                +email: ?string;
              |};
            |};
          |}>;
        |};
        +checkins: ?{|
          +edges: ?$ReadOnlyArray<?{|
            +node: {|
              +id: string;
              +description: ?string;
              +approved: ?boolean;
              +approvalTime: ?any;
              +checkinAt: any;
              +checkoutAt: ?any;
              +rejectionDescription: ?string;
              +canceled: ?boolean;
              +placeReview: ?{|
                +description: ?string;
                +rate: number;
              |};
              +user: {|
                +id: string;
                +name: string;
                +email: ?string;
                +technologies: ?{|
                  +edges: ?$ReadOnlyArray<?{|
                    +node: {|
                      +id: string;
                      +technology: {|
                        +id: string;
                        +name: string;
                      |};
                    |};
                  |}>;
                |};
              |};
              +place: {|
                +id: string;
                +name: string;
                +address: string;
                +address2: ?string;
                +city: string;
                +state: string;
                +zip: string;
                +postedBy: {|
                  +name: string;
                  +email: ?string;
                |};
              |};
            |};
          |}>;
        |};
      |};
    |}>;
  |};
|};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "count",
      "type": "Int"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": null,
        "direction": "forward",
        "path": [
          "allPlaces"
        ]
      }
    ]
  },
  "name": "MapMarkerList_viewer",
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "allPlaces",
      "args": null,
      "concreteType": "PlaceConnection",
      "name": "__MapMarkerList_allPlaces_connection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "args": null,
          "concreteType": "PlaceEdge",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "args": null,
              "concreteType": "Place",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "rooms",
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "id",
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "latitude",
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "longitude",
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "description",
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "address",
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "address2",
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "city",
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "state",
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "zip",
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "name",
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "needApproval",
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "phone",
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "url",
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "email",
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "args": null,
                  "concreteType": "PlaceScheduleConnection",
                  "name": "schedules",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "args": null,
                      "concreteType": "PlaceScheduleEdge",
                      "name": "edges",
                      "plural": true,
                      "selections": [
                        {
                          "kind": "LinkedField",
                          "alias": null,
                          "args": null,
                          "concreteType": "PlaceSchedule",
                          "name": "node",
                          "plural": false,
                          "selections": [
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "args": null,
                              "name": "id",
                              "storageKey": null
                            },
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "args": null,
                              "name": "day",
                              "storageKey": null
                            },
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "args": null,
                              "name": "startTime",
                              "storageKey": null
                            },
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "args": null,
                              "name": "endTime",
                              "storageKey": null
                            }
                          ],
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "images",
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "args": null,
                  "concreteType": "PlaceType",
                  "name": "type",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "args": null,
                      "name": "id",
                      "storageKey": null
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "args": null,
                      "name": "name",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "args": null,
                  "concreteType": "PlaceReviewConnection",
                  "name": "reviews",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "args": null,
                      "concreteType": "PlaceReviewEdge",
                      "name": "edges",
                      "plural": true,
                      "selections": [
                        {
                          "kind": "LinkedField",
                          "alias": null,
                          "args": null,
                          "concreteType": "PlaceReview",
                          "name": "node",
                          "plural": false,
                          "selections": [
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "args": null,
                              "name": "id",
                              "storageKey": null
                            },
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "args": null,
                              "name": "rate",
                              "storageKey": null
                            },
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "args": null,
                              "name": "description",
                              "storageKey": null
                            },
                            {
                              "kind": "LinkedField",
                              "alias": null,
                              "args": null,
                              "concreteType": "User",
                              "name": "postedBy",
                              "plural": false,
                              "selections": [
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "args": null,
                                  "name": "id",
                                  "storageKey": null
                                },
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "args": null,
                                  "name": "name",
                                  "storageKey": null
                                },
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "args": null,
                                  "name": "email",
                                  "storageKey": null
                                }
                              ],
                              "storageKey": null
                            }
                          ],
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "args": [
                    {
                      "kind": "Literal",
                      "name": "filter",
                      "value": {
                        "approvalTime_not": null,
                        "approved": true,
                        "OR": [
                          {
                            "canceled": false
                          },
                          {
                            "canceled": null
                          }
                        ]
                      },
                      "type": "CheckinFilter"
                    },
                    {
                      "kind": "Literal",
                      "name": "orderBy",
                      "value": "checkinAt_DESC",
                      "type": "CheckinOrderBy"
                    }
                  ],
                  "concreteType": "CheckinConnection",
                  "name": "checkins",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "args": null,
                      "concreteType": "CheckinEdge",
                      "name": "edges",
                      "plural": true,
                      "selections": [
                        {
                          "kind": "LinkedField",
                          "alias": null,
                          "args": null,
                          "concreteType": "Checkin",
                          "name": "node",
                          "plural": false,
                          "selections": [
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "args": null,
                              "name": "checkoutAt",
                              "storageKey": null
                            },
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "args": null,
                              "name": "id",
                              "storageKey": null
                            },
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "args": null,
                              "name": "approved",
                              "storageKey": null
                            },
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "args": null,
                              "name": "approvalTime",
                              "storageKey": null
                            },
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "args": null,
                              "name": "checkinAt",
                              "storageKey": null
                            },
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "args": null,
                              "name": "description",
                              "storageKey": null
                            },
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "args": null,
                              "name": "rejectionDescription",
                              "storageKey": null
                            },
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "args": null,
                              "name": "canceled",
                              "storageKey": null
                            },
                            {
                              "kind": "LinkedField",
                              "alias": null,
                              "args": null,
                              "concreteType": "PlaceReview",
                              "name": "placeReview",
                              "plural": false,
                              "selections": [
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "args": null,
                                  "name": "description",
                                  "storageKey": null
                                },
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "args": null,
                                  "name": "rate",
                                  "storageKey": null
                                }
                              ],
                              "storageKey": null
                            },
                            {
                              "kind": "LinkedField",
                              "alias": null,
                              "args": null,
                              "concreteType": "User",
                              "name": "user",
                              "plural": false,
                              "selections": [
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "args": null,
                                  "name": "id",
                                  "storageKey": null
                                },
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "args": null,
                                  "name": "name",
                                  "storageKey": null
                                },
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "args": null,
                                  "name": "email",
                                  "storageKey": null
                                },
                                {
                                  "kind": "LinkedField",
                                  "alias": null,
                                  "args": null,
                                  "concreteType": "UserTechnologyConnection",
                                  "name": "technologies",
                                  "plural": false,
                                  "selections": [
                                    {
                                      "kind": "LinkedField",
                                      "alias": null,
                                      "args": null,
                                      "concreteType": "UserTechnologyEdge",
                                      "name": "edges",
                                      "plural": true,
                                      "selections": [
                                        {
                                          "kind": "LinkedField",
                                          "alias": null,
                                          "args": null,
                                          "concreteType": "UserTechnology",
                                          "name": "node",
                                          "plural": false,
                                          "selections": [
                                            {
                                              "kind": "ScalarField",
                                              "alias": null,
                                              "args": null,
                                              "name": "id",
                                              "storageKey": null
                                            },
                                            {
                                              "kind": "LinkedField",
                                              "alias": null,
                                              "args": null,
                                              "concreteType": "Technology",
                                              "name": "technology",
                                              "plural": false,
                                              "selections": [
                                                {
                                                  "kind": "ScalarField",
                                                  "alias": null,
                                                  "args": null,
                                                  "name": "id",
                                                  "storageKey": null
                                                },
                                                {
                                                  "kind": "ScalarField",
                                                  "alias": null,
                                                  "args": null,
                                                  "name": "name",
                                                  "storageKey": null
                                                }
                                              ],
                                              "storageKey": null
                                            }
                                          ],
                                          "storageKey": null
                                        }
                                      ],
                                      "storageKey": null
                                    }
                                  ],
                                  "storageKey": null
                                }
                              ],
                              "storageKey": null
                            },
                            {
                              "kind": "LinkedField",
                              "alias": null,
                              "args": null,
                              "concreteType": "Place",
                              "name": "place",
                              "plural": false,
                              "selections": [
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "args": null,
                                  "name": "id",
                                  "storageKey": null
                                },
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "args": null,
                                  "name": "name",
                                  "storageKey": null
                                },
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "args": null,
                                  "name": "address",
                                  "storageKey": null
                                },
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "args": null,
                                  "name": "address2",
                                  "storageKey": null
                                },
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "args": null,
                                  "name": "city",
                                  "storageKey": null
                                },
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "args": null,
                                  "name": "state",
                                  "storageKey": null
                                },
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "args": null,
                                  "name": "zip",
                                  "storageKey": null
                                },
                                {
                                  "kind": "LinkedField",
                                  "alias": null,
                                  "args": null,
                                  "concreteType": "User",
                                  "name": "postedBy",
                                  "plural": false,
                                  "selections": [
                                    {
                                      "kind": "ScalarField",
                                      "alias": null,
                                      "args": null,
                                      "name": "name",
                                      "storageKey": null
                                    },
                                    {
                                      "kind": "ScalarField",
                                      "alias": null,
                                      "args": null,
                                      "name": "email",
                                      "storageKey": null
                                    }
                                  ],
                                  "storageKey": null
                                }
                              ],
                              "storageKey": null
                            }
                          ],
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": "checkins{\"filter\":{\"OR\":[{\"canceled\":false},{\"canceled\":null}],\"approvalTime_not\":null,\"approved\":true},\"orderBy\":\"checkinAt_DESC\"}"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "kind": "InlineFragment",
          "type": "PlaceConnection",
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "args": null,
              "concreteType": "PlaceEdge",
              "name": "edges",
              "plural": true,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "cursor",
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "args": null,
                  "concreteType": "Place",
                  "name": "node",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "args": null,
                      "name": "__typename",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "args": null,
              "concreteType": "PageInfo",
              "name": "pageInfo",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "endCursor",
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "hasNextPage",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ]
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Viewer"
};

module.exports = fragment;

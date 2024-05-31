/*
 * This file is part of Invenio.
 * Copyright (C) 2015, 2016, 2017, 2018 CERN.
 *
 * Invenio is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * Invenio is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Invenio; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.

* In applying this license, CERN does not
* waive the privileges and immunities granted to it by virtue of its status
* as an Intergovernmental Organization or submit itself to any jurisdiction.
*/

import d3 from "d3";
import angular from "angular";
import "angular-loading-bar";
import "ngclipboard";
import "angular-ui-bootstrap";
import "angular-schema-form";
import "angular-schema-form-bootstrap";
import "angular-schema-form-dynamic-select";
import "ng-dialog";
import "angular-mass-autocomplete";
import "invenio-search-js/dist/invenio-search-js";
import "@js/cds/module";
import "@js/cds_deposit/avc/avc.module";
import "@js/cds_deposit/avc/filters/progressClass.js";
import "@js/cds_deposit/avc/filters/progressIcon.js";
import "@js/cds_deposit/avc/filters/progressIcon.js";

import "@js/cds/suggestions";

import $ from "jquery";

function mainCtrl(
  $scope,
  $sce,
  $q,
  $http,
  localStorageService,
  searchSuggestions
) {
  $scope.dirty = {};

  $scope.updateHistory = function () {
    searchSuggestions.onSelect(
      { label: $scope.dirty.value, value: $scope.dirty.value },
      true
    );
  };

  $scope.autocomplete_options = {
    suggest: searchSuggestions.suggestStateRemote,
    on_select: searchSuggestions.onSelect,
    on_attach: function () {
      $scope.focused = true;
    },
  };

  // Dismiss the popover by clicking outside
  $(document).on("click", function (e) {
    $("a[rel=popover]").each(function () {
      var $this = $(this);

      if (
        !$this.is(e.target) &&
        $this.has(e.target).length === 0 &&
        $(".popover").has(e.target).length === 0
      ) {
        $this.popover("hide").data("bs.popover").inState.click = false;
      }
    });
  });
}

angular
  .module("cdsSuggest", ["MassAutoComplete", "cdsSharedServices"])
  .controller("mainCtrl", mainCtrl);

/**
 * Additional fun features
 */
$(document).ready(function () {
  function toggleAnnouncement() {
    $.get(
      "/api/announcement",
      /* eslint-disable no-restricted-globals */
      { pathname: location.pathname },
      function (result) {
        if (result && result.message) {
          $("#announcement")
            .addClass("alert-" + result.style)
            .removeClass("hidden")
            .html(result.message);

          // Hack to fix wrong margin on deposit view
          $("#cds-deposit").addClass("fix-margin-top");
        } else {
          $("#announcement").addClass("hidden");
        }
      }
    );
  }

  // Load and show any announcement message
  toggleAnnouncement();

  $("#cds-navbar-form-input")
    .focus(function () {
      $(".cds-navbar-form").addClass("cds-active-search");
    })
    .blur(function () {
      $(".cds-navbar-form").removeClass("cds-active-search");
    });
});

// Bootstrap modules
angular.element(document).ready(function () {
  angular.bootstrap(document.getElementById("invenio-search"), [
    "cds",
    "angular-loading-bar",
    "ngDialog",
    "invenioSearch",
  ]);
  angular.bootstrap(document.getElementById("cds-featured-video"), [
    "cds",
    "invenioSearch",
  ]);
  angular.bootstrap(document.getElementById("cds-recent-videos"), [
    "cds",
    "invenioSearch",
  ]);
});

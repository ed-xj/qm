(function() {
var toc =  [ { "type" : "item", "name" : "API Command Reference", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/API_Command_Reference.htm" }, { "type" : "item", "name" : "Abort", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Abort.htm" }, { "type" : "item", "name" : "Align", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Align.htm" }, { "type" : "item", "name" : "Config", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Config.htm" }, { "type" : "item", "name" : "Delete", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Delete.htm" }, { "type" : "item", "name" : "DeleteFrame", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/DeleteFrame.htm" }, { "type" : "item", "name" : "Dir", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Dir.htm" }, { "type" : "item", "name" : "EFnum", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/EFnum.htm" }, { "type" : "item", "name" : "Event", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Event.htm" }, { "type" : "item", "name" : "Fiduciary", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Fiduciary.htm" }, { "type" : "item", "name" : "Flip", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Flip.htm" }, { "type" : "item", "name" : "Flipper", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Flipper.htm" }, { "type" : "item", "name" : "Flush", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Flush.htm" }, { "type" : "item", "name" : "Get", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Get.htm" }, { "type" : "item", "name" : "GetFrame(s)", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/GetFrame(s).htm" }, { "type" : "item", "name" : "GetStation(s)", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/GetStation(s).htm" }, { "type" : "item", "name" : "GetXYZWPR", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/GetXYZWPR.htm" }, { "type" : "item", "name" : "Grip", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Grip.htm" }, { "type" : "item", "name" : "Help", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Help.htm" }, { "type" : "item", "name" : "Init", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Init.htm" }, { "type" : "item", "name" : "LCM", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/LCM.htm" }, { "type" : "item", "name" : "Learn", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Learn.htm" }, { "type" : "item", "name" : "Logfile", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Logfile.htm" }, { "type" : "item", "name" : "Map", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Map.htm" }, { "type" : "item", "name" : "Mapper", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Mapper.htm" }, { "type" : "item", "name" : "Move", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Move.htm" }, { "type" : "item", "name" : "Output", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Output.htm" }, { "type" : "item", "name" : "Passcontrol", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Passcontrol.htm" }, { "type" : "item", "name" : "Pause", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Pause.htm" }, { "type" : "item", "name" : "Pick", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Pick.htm" }, { "type" : "item", "name" : "Place", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Place.htm" }, { "type" : "item", "name" : "RCP", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/RCP.htm" }, { "type" : "item", "name" : "Recover", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Recover.htm" }, { "type" : "item", "name" : "Release", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Release.htm" }, { "type" : "item", "name" : "Remove", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Remove.htm" }, { "type" : "item", "name" : "Reset", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Reset.htm" }, { "type" : "item", "name" : "Restore", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Restore.htm" }, { "type" : "item", "name" : "Resume", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Resume.htm" }, { "type" : "item", "name" : "Retract", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Retract.htm" }, { "type" : "item", "name" : "RTP", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/RTP.htm" }, { "type" : "item", "name" : "Save", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Save.htm" }, { "type" : "item", "name" : "Seize", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Seize.htm" }, { "type" : "item", "name" : "Set", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Set.htm" }, { "type" : "item", "name" : "SetFrame", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/SetFrame.htm" }, { "type" : "item", "name" : "Sim", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Sim.htm" }, { "type" : "item", "name" : "Speed", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Speed.htm" }, { "type" : "item", "name" : "Status", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Status.htm" }, { "type" : "item", "name" : "Unsim", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Unsim.htm" }, { "type" : "item", "name" : "VacOff", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/VacOff.htm" }, { "type" : "item", "name" : "VacOn", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/VacOn.htm" }, { "type" : "item", "name" : "VacThreshSet", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/VacThreshSet.htm" }, { "type" : "item", "name" : "Version", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Version.htm" }, { "type" : "item", "name" : "Wait", "url" : "Appendix_C/Scara_Robot_API/API_Command_Reference/Wait.htm" } ];
window.rh.model.publish(rh.consts('KEY_TEMP_DATA'), toc, { sync:true });
})();